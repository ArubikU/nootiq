"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useUser } from "@clerk/nextjs"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded) {
      // Obtener tema del usuario o del sistema/localStorage
      let initialTheme: Theme
      
      if (user) {
        // Si hay usuario, usar su preferencia guardada
        const userTheme = user.unsafeMetadata.theme as Theme || user.publicMetadata.theme as Theme
        initialTheme = userTheme || getSystemTheme()
      } else {
        // Si no hay usuario, usar localStorage o sistema
        const savedTheme = localStorage.getItem("theme") as Theme
        initialTheme = savedTheme || getSystemTheme()
      }

      setThemeState(initialTheme)
      applyTheme(initialTheme)
    }else{
        
      let initialTheme: Theme
        // Si no hay usuario, usar localStorage o sistema
        const savedTheme = localStorage.getItem("theme") as Theme
        initialTheme = savedTheme || getSystemTheme()
      setThemeState(initialTheme)
      applyTheme(initialTheme)
    }
  }, [isLoaded, user])

  const getSystemTheme = (): Theme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    
    localStorage.setItem("theme", newTheme)
  }

const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    
}

const updateUserTheme = async (newTheme: Theme) => {
    if (!user) return
    try {
        await user.update({
            unsafeMetadata: { 
                ...(user.unsafeMetadata || {}), 
                theme: newTheme 
            }
        })
    } catch (error) {
        console.error("Error updating user theme:", error)
    }
}

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateUserTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider")
  }
  return context
}
