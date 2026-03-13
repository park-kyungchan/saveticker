/**
 * 플레이스홀더 페이지 — 미구현 탭용.
 * Placeholder page for tabs not yet implemented.
 */
import { PageHeader } from "../../components/ui/PageHeader";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div data-label="placeholder.page" className="space-y-6">
      <PageHeader title={title} />
      <div
        data-label="placeholder.page.content"
        className="flex flex-col items-center justify-center rounded-xl border glass-panel p-8 text-center shadow-md"
      >
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border glass-panel shadow-sm" aria-hidden="true">
          <svg className="size-6 text-ink-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
          </svg>
        </div>
        <p data-label="placeholder.page.description" className="text-sm text-ink-muted max-w-[260px]">
          {description}
        </p>
        <p className="mt-2 text-xs text-ink-muted/60">
          이 기능은 SAVE 앱과 동일한 구조로, 프로토타입에서는 준비 중입니다.
        </p>
      </div>
    </div>
  );
}
