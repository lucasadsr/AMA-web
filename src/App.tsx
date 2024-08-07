import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CreateRoom } from './pages/create-room'
import { Room } from './pages/room'

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
  return <RouterProvider router={router} />
}

export default App