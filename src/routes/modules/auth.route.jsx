import GuestRoute from '@/shared/components/GuestRoute/index.jsx'
import AuthLayout from '@/pages/Auth/index.jsx'
import LoginPage from '@/pages/Auth/Login.jsx'
import RegisterPage from '@/pages/Auth/Register.jsx'
import { ROUTE_PATHS } from '@/routes/paths.js'

export const authRoute = {
  path: ROUTE_PATHS.AUTH.ROOT,
  element: <GuestRoute />,
  children: [
    {
      element: <AuthLayout />,
      children: [
        {
          path: ROUTE_PATHS.AUTH.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTE_PATHS.AUTH.REGISTER,
          element: <RegisterPage />,
        },
      ],
    },
  ],
}
