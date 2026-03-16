import type { Task } from "../../../api/boards";


interface Props {
  task: Task;
  onDragStart: (taskId: string, columnId: string) => void;
  columnId: string;
}

export default function TaskCard({ task, onDragStart, columnId }: Props) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id, columnId)}
      className="bg-gray-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-500"
    >
      <p className="text-white text-sm font-medium">{task.title}</p>
      {task.description && (
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      {task.assignee && (
        <div className="flex items-center gap-2 mt-2">
          <img src={task.assignee.avatarUrl} className="w-5 h-5 rounded-full" />
          <span className="text-gray-500 text-xs">{task.assignee.name}</span>
        </div>
      )}
    </div>
  );
}
