import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { useBoards, useCreateBoard } from './api/boards'
import LoginPage from './features/auth/LoginPage'
import CallbackPage from './features/auth/CallbackPage'
import api from './lib/axios'
import BoardPage from './features/auth/board/BoardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const { data: boards = [] } = useBoards()
  const createBoard = useCreateBoard()

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [boardName, setBoardName] = useState('')

  useEffect(() => {
    api.get('/auth/me').then((res) => setUser(res.data))
  }, [])

  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id)
    }
  }, [boards])

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return
    const board = await createBoard.mutateAsync({ name: boardName, description: '' })
    setSelectedBoardId(board.id)
    setBoardName('')
    setCreating(false)
  }

  const selectedBoard = boards.find((b) => b.id === selectedBoardId)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">DevFlow</h1>

          {/* Board tabs */}
          <div className="flex items-center gap-1">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedBoardId === board.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {board.name}
              </button>
            ))}
            <button
              onClick={() => setCreating(true)}
              className="text-gray-500 hover:text-white text-sm px-2 py-1.5 transition-colors"
            >
              + New board
            </button>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <img src={user.avatarUrl} className="w-7 h-7 rounded-full" />
              <span className="text-gray-300 text-sm">{user.name}</span>
            </>
          )}
          <button
            onClick={logout}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Board name */}
      {selectedBoard && (
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold">{selectedBoard.name}</h2>
        </div>
      )}

      {/* Create board modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 flex flex-col gap-4 border border-gray-700">
            <h3 className="text-white font-semibold">New board</h3>
            <input
              autoFocus
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              placeholder="Board name..."
              className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBoard}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => { setCreating(false); setBoardName('') }}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedBoardId ? (
          <BoardPage boardId={selectedBoardId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Create your first board to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}