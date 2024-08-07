import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateRoom } from './pages/create-room'
import { Room } from './pages/room'
import { Toaster } from 'sonner'

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
    <>
      <RouterProvider router={router} />
      <Toaster invert richColors />
    </>
  )
}

export default App