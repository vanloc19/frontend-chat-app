import ProtectedRoute from '@/shared/components/ProtectedRoute/index.jsx'
import HomePage from '@/pages/Home/index.jsx'

export const homeRoute = {
  path: '/',
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
  ],
}
