import { Routes, Route } from "react-router";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { RootLayout } from "./layouts/RootLayout";
import { NewsPage } from "./pages/NewsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { MorePage } from "../features/user/pages/MorePage";
import { NewsDetailPage } from "../features/news-article/pages/NewsDetailPage";

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Tab routes — 5탭 */}
          <Route index element={<ErrorBoundary><NewsPage /></ErrorBoundary>} />
          <Route path="reports" element={<PlaceholderPage title="리포트" description="기업 리포트와 분석 자료" />} />
          <Route path="community" element={<PlaceholderPage title="커뮤니티" description="투자자 커뮤니티" />} />
          <Route path="calendar" element={<PlaceholderPage title="캘린더" description="투자 캘린더와 경제 지표 일정" />} />
          <Route path="profile" element={<MorePage />} />

          {/* Detail routes */}
          <Route path="news/:id" element={<ErrorBoundary><NewsDetailPage /></ErrorBoundary>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
