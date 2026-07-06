# Core2Advanced

A visual learning platform for understanding what happens under the hood — starting with Python internals.

## Structure

```
src/
  content/
    types.ts              # Topic, SubTopic, Lesson types
    registry.ts           # Central lookup helpers
    topics/
      python/
        index.ts          # Topic definition
        introduction/
          index.ts        # Sub-topic + lesson list
          lessons/        # One file per lesson (content lives here)
  components/
    content/              # Reusable lesson building blocks
    layout/               # Shell, sidebar, lesson frame
  pages/                  # Route-level pages
```

### Adding a new lesson

1. Create `src/content/topics/<topic>/<subtopic>/lessons/my-lesson.tsx`
2. Export a component using the shared content components (`LessonSection`, `Flowchart`, etc.)
3. Register it in the sub-topic's `index.ts`

### Adding a new sub-topic or topic

1. Create a folder under `src/content/topics/`
2. Wire it into the topic's `index.ts`
3. Add the topic to `src/content/registry.ts`

## Development

```bash
npm install
npm run dev
```

## Stack

- React + Vite + TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Mermaid for flowcharts
