import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'

// ─── Types ────────────────────────────────────────────────────

export interface Board {
  id: string
  name: string
  description: string
  owner: { id: string; name: string; avatarUrl: string }
}

export interface BoardColumn {
  id: string
  name: string
  position: number
}

export interface Task {
  id: string
  title: string
  description: string
  position: number
  assignee?: { id: string; name: string; avatarUrl: string }
}

// ─── Boards ───────────────────────────────────────────────────

export const useBoards = () =>
  useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get<Board[]>('/boards').then((r) => r.data),
  })

export const useCreateBoard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      api.post<Board>('/boards', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards'] }),
  })
}

// ─── Columns ──────────────────────────────────────────────────

export const useColumns = (boardId: string) =>
  useQuery({
    queryKey: ['columns', boardId],
    queryFn: () =>
      api.get<BoardColumn[]>(`/boards/${boardId}/columns`).then((r) => r.data),
  })

export const useCreateColumn = (boardId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string }) =>
      api.post<BoardColumn>(`/boards/${boardId}/columns`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['columns', boardId] }),
  })
}

// ─── Tasks ────────────────────────────────────────────────────

export const useTasks = (columnId: string) =>
  useQuery({
    queryKey: ['tasks', columnId],
    queryFn: () =>
      api.get<Task[]>(`/boards/columns/${columnId}/tasks`).then((r) => r.data),
  })

export const useCreateTask = (columnId: string, _boardId?: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      api.post<Task>(`/boards/columns/${columnId}/tasks`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', columnId] }),
  })
}

export const useMoveTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { taskId: string; columnId: string; position: number }) =>
      api.patch(`/boards/tasks/${data.taskId}/move`, {
        columnId: data.columnId,
        position: data.position,
      }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}