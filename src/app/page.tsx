import { KanbanBoard } from '@/components/KanbanBoard';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <KanbanBoard />
    </div>
  );
}
