import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { TopicPage } from './pages/TopicPage'
import { LessonPage } from './pages/LessonPage'

export default function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:topicId" element={<TopicPage />} />
        <Route path="/:topicId/:subTopicId" element={<LessonPage />} />
        <Route path="/:topicId/:subTopicId/:lessonId" element={<LessonPage />} />
      </Routes>
    </AppShell>
  )
}
