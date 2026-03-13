import { useEffect, useState } from 'react'
import { userService } from '@/services/user.service.js'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    userService
      .getMe()
      .then(() => {
        if (mounted) setIsAuthenticated(true)
      })
      .catch(() => {
        if (mounted) setIsAuthenticated(false)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { isAuthenticated, isLoading }
}
