"use client";

import { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from '../types' // adjust or remove based on your type definitions
import { createClient } from '../client/client'
import { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null
  userRole: string | null
  loading: boolean
  error: Error | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()

        // Get the user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) {
          throw new Error(userError.message)
        }
        setUser(userData.user)

        // Get the session and decode the access token to extract user role
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          throw new Error(sessionError.message)
        }
        setAccessToken(sessionData.session?.access_token)
        if (!accessToken) {
          setUserRole(null)
        } else {
          const decoded = jwtDecode<CustomJwtPayload>(accessToken)
          setUserRole(decoded.user_role)
        }
      } catch (err: any) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { user, userRole, loading, error }
}
