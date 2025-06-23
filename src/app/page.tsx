import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Kanban Project Manager
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize your tasks with drag & drop simplicity
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with Next.js & shadcn/ui
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <KanbanBoard />
      </main>
    </div>
  );
}
