import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import { useColumns, useCreateColumn, useMoveTask } from '../../../api/boards'

interface Props {
  boardId: string
}

export default function BoardPage({ boardId }: Props) {
  const { data: columns = [] } = useColumns(boardId)
  const createColumn = useCreateColumn(boardId)
  const moveTask = useMoveTask()

  const [addingColumn, setAddingColumn] = useState(false)
  const [columnName, setColumnName] = useState('')
  const [dragging, setDragging] = useState<{ taskId: string; fromColumnId: string } | null>(null)

  const handleDragStart = (taskId: string, columnId: string) => {
    setDragging({ taskId, fromColumnId: columnId })
  }

  const handleDrop = (toColumnId: string) => {
    if (!dragging || dragging.fromColumnId === toColumnId) return
    moveTask.mutate({
      taskId: dragging.taskId,
      columnId: toColumnId,
      position: 0,
    })
    setDragging(null)
  }

  const handleAddColumn = async () => {
    if (!columnName.trim()) return
    await createColumn.mutateAsync({ name: columnName })
    setColumnName('')
    setAddingColumn(false)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          boardId={boardId}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}

      {/* Add column */}
      {addingColumn ? (
        <div className="bg-gray-900 rounded-xl p-3 w-72 flex-shrink-0 border border-gray-800 flex flex-col gap-2">
          <input
            autoFocus
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
            placeholder="Column name..."
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddColumn}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setAddingColumn(false); setColumnName('') }}
              className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingColumn(true)}
          className="bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl px-4 py-3 w-72 flex-shrink-0 text-sm text-left border border-gray-800 transition-colors"
        >
          + Add column
        </button>
      )}
    </div>
  )
}