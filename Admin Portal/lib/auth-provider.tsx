"use client"

import type { ReactNode } from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Auth types
export type User = {
  id: string
  username: string
  email: string
  companyName?: string
  address?: string
  taxId?: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

// Registration form state
export type RegistrationData = {
  username: string
  email: string
  password: string
  companyName: string
  address: string
  taxId: string
}

export const useRegistrationStore = create(
  persist<{
    data: Partial<RegistrationData>
    setData: (data: Partial<RegistrationData>) => void
    clearData: () => void
  }>(
    (set) => ({
      data: {},
      setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
      clearData: () => set({ data: {} }),
    }),
    {
      name: "registration-storage",
    },
  ),
)

// Auth store with Zustand
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Mock API call
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: "1",
        username: "demo_user",
        email: email,
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({ user: mockUser, isAuthenticated: true })
    } catch (error) {
      throw new Error("Invalid credentials")
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  register: async (userData) => {
    // Mock API call
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: "1",
        username: userData.username || "",
        email: userData.email || "",
        companyName: userData.companyName,
        address: userData.address,
        taxId: userData.taxId,
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      set({ user: mockUser, isAuthenticated: true })
    } catch (error) {
      throw new Error("Registration failed")
    }
  },
  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }))
  },
}))

// Auth context
const AuthContext = createContext<{
  isAuthenticated: boolean
  isLoading: boolean
}>({
  isAuthenticated: false,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

// Protected routes
const publicRoutes = ["/login", "/register", "/register/company"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState("")

  useEffect(() => {
    // Check if the route is protected
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isAuthenticated && !isPublicRoute) {
      setShouldRedirect(true)
      setRedirectPath("/login")
    } else if (isAuthenticated && isPublicRoute && pathname !== "/register/company") {
      setShouldRedirect(true)
      setRedirectPath("/dashboard")
    } else {
      setShouldRedirect(false)
    }

    setIsLoading(false)
  }, [isAuthenticated, pathname])

  useEffect(() => {
    if (shouldRedirect && redirectPath && !isLoading) {
      router.push(redirectPath)
    }
  }, [shouldRedirect, redirectPath, isLoading, router])

  return <AuthContext.Provider value={{ isAuthenticated, isLoading }}>{children}</AuthContext.Provider>
}

