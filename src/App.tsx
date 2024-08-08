import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateRoom } from './pages/create-room'
import { Room } from './pages/room'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateRoom />
  },
  {
    path: '/room/:roomID',
    element: <Room />
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster invert richColors />
    </ QueryClientProvider>
  )
}

export default App