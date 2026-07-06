import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-950">
      <header className="sticky top-0 z-30 border-b border-surface-700/80 bg-surface-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight text-white">
              Core<span className="text-accent-400">2</span>Advanced
            </span>
          </Link>
          <p className="hidden text-sm text-slate-400 sm:block">
            Deep dives, explained visually
          </p>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
