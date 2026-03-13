/**
 * 스토리 스레드 목록 페이지 — 상태별 탭 필터링.
 * Story threads list page — tab-based status filtering.
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { useThreadsByStatus } from "../hooks/useThreadsByStatus";
import { ThreadCard } from "../components/ThreadCard";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Tabs } from "../../../components/ui/Tabs";
import { Spinner } from "../../../components/ui/Spinner";
import { EmptyState } from "../../../components/ui/EmptyState";

/** Tab items for thread status filter / 스레드 상태 필터 탭 항목 */
const statusTabs = [
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
] as const;

/**
 * 스토리 스레드 목록 페이지 컴포넌트.
 * Story threads list page component with status tabs.
 */
export function ThreadsPage() {
  const [status, setStatus] = useState<"active" | "completed">("active");
  const navigate = useNavigate();
  const threads = useThreadsByStatus(status);

  return (
    <div data-label="threads.page" className="space-y-4">
      <PageHeader title="스토리 스레드" />

      {/* Status tabs / 상태 탭 */}
      <Tabs
        items={[...statusTabs]}
        value={status}
        onChange={(v) => setStatus(v as "active" | "completed")}
      />

      {/* Content / 콘텐츠 */}
      {threads === undefined ? (
        <div data-label="threads.page.loading" className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : threads.length === 0 ? (
        <EmptyState
          title={status === "active" ? "진행 중인 스레드가 없습니다" : "완료된 스레드가 없습니다"}
          description="새로운 뉴스 기사가 스레드에 추가되면 여기에 표시됩니다"
        />
      ) : (
        <div data-label="threads.page.list" className="space-y-2 animate-in">
          {threads.map((thread, i) => (
            <ThreadCard
              key={thread._id}
              thread={thread}
              onClick={() => navigate(`/threads/${thread._id}`)}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
