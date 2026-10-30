import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <h1 className="text-4xl font-bold text-green-900">
        Lush Living
      </h1>
    </main>
  )
}