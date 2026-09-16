import { Routes, Route, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'
import { LessonPage } from './pages/LessonPage'

export default function App() {
  const location = useLocation()

  return (
    <AppShell>
      <ScrollToTop />
      <ErrorBoundary resetKey={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:topicId" element={<TopicPage />} />
          <Route path="/:topicId/:subTopicId" element={<LessonPage />} />
          <Route path="/:topicId/:subTopicId/:lessonId" element={<LessonPage />} />
        </Routes>
      </ErrorBoundary>
    </AppShell>
  )
}
