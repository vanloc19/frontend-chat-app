import { createHashRouter } from 'react-router-dom'
import App from '@/app/App.jsx'
import { authRoute } from '@/routes/modules/auth.route.jsx'
import { homeRoute } from '@/routes/modules/home.route.jsx'
import { ROUTE_PATHS } from '@/routes/paths.js'
import NotFoundPage from '@/pages/NotFound/index.jsx'

export const router = createHashRouter([
  {
    path: ROUTE_PATHS.ROOT,
    element: <App />,
    children: [homeRoute, authRoute, { path: ROUTE_PATHS.NOT_FOUND, element: <NotFoundPage /> }],
  },
])
