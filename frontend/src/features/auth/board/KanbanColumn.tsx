import { useState } from 'react'
import TaskCard from './TaskCard'
import { useCreateTask, useTasks, type BoardColumn } from '../../../api/boards'

interface Props {
  column: BoardColumn
  boardId: string
  onDragStart: (taskId: string, columnId: string) => void
  onDrop: (columnId: string) => void
}

export default function KanbanColumn({ column, boardId, onDragStart, onDrop }: Props) {
  const { data: tasks = [] } = useTasks(column.id)
  const createTask = useCreateTask(column.id, boardId)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) return
    await createTask.mutateAsync({ title, description: '' })
    setTitle('')
    setAdding(false)
  }

  return (
    <div
      className={`bg-gray-900 rounded-xl p-3 w-72 flex-shrink-0 flex flex-col gap-2 border transition-colors ${
        dragOver ? 'border-blue-500' : 'border-gray-800'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => { setDragOver(false); onDrop(column.id) }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-gray-300 font-medium text-sm">{column.name}</h3>
        <span className="text-gray-600 text-xs">{tasks.length}</span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      {/* Add task */}
      {adding ? (
        <div className="flex flex-col gap-2 mt-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Task title..."
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setTitle('') }}
              className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-gray-500 hover:text-gray-300 text-sm text-left px-1 py-1 transition-colors"
        >
          + Add task
        </button>
      )}
    </div>
  )
}