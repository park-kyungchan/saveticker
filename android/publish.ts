/**
 * Play Store internal test track publisher.
 * Usage: bun run android/publish.ts
 */
import { GoogleAuth } from "google-auth-library";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);

function readPackageName(): string {
  const gradle = readFileSync(join(SCRIPT_DIR, "app/build.gradle"), "utf-8");
  const match = gradle.match(/applicationId\s+"([^"]+)"/);
  if (!match) throw new Error("Could not find applicationId in build.gradle");
  return match[1];
}

function findAab(): string {
  const output = execSync(
    "find android/app/build/outputs/bundle/release -name '*.aab' -type f",
    { cwd: join(SCRIPT_DIR, ".."), encoding: "utf-8" },
  ).trim();
  if (!output) throw new Error("No AAB file found. Run bundleRelease first.");
  return join(SCRIPT_DIR, "..", output);
}

function getVersionCode(): number {
  const gradle = readFileSync(join(SCRIPT_DIR, "app/build.gradle"), "utf-8");
  const match = gradle.match(/versionCode\s+(\d+)/);
  if (!match) throw new Error("Could not find versionCode in build.gradle");
  return parseInt(match[1], 10);
}

async function publish() {
  const packageName = readPackageName();
  const track = "internal";

  const auth = new GoogleAuth({
    keyFile: join(SCRIPT_DIR, "play-service-account.json"),
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
  const client = await auth.getClient();
  const baseUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}`;

  // 1. Create edit
  console.log(`Publishing ${packageName} to ${track} track...`);
  const editRes = await client.request({
    url: `${baseUrl}/edits`,
    method: "POST",
  });
  const editId = (editRes.data as any).id;
  console.log(`Edit created: ${editId}`);

  // 2. Upload AAB
  const aabPath = findAab();
  const aabBuffer = readFileSync(aabPath);
  console.log(
    `Uploading AAB (${(aabBuffer.length / 1024 / 1024).toFixed(1)} MB)...`,
  );

  const uploadRes = await client.request({
    url: `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${packageName}/edits/${editId}/bundles?uploadType=media`,
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    data: aabBuffer,
  });
  const uploadedVersionCode = (uploadRes.data as any).versionCode;
  console.log(`AAB uploaded, versionCode: ${uploadedVersionCode}`);

  // 3. Assign to internal track
  console.log(`Assigning to ${track} track...`);
  await client.request({
    url: `${baseUrl}/edits/${editId}/tracks/${track}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: {
      track,
      releases: [
        {
          status: "draft",
          versionCodes: [uploadedVersionCode.toString()],
        },
      ],
    },
  });

  // 4. Commit edit
  console.log("Committing edit...");
  await client.request({
    url: `${baseUrl}/edits/${editId}:commit`,
    method: "POST",
  });

  console.log(`\nPublished to ${track} track successfully!`);
  console.log(`Package: ${packageName}`);
  console.log(`Version code: ${uploadedVersionCode}`);
}

publish().catch((err) => {
  console.error("Publish failed:", err.message);
  if (err.response?.data) {
    console.error(
      "API error:",
      JSON.stringify(err.response.data, null, 2),
    );
  }
  process.exit(1);
});
