
import { AuthProvider, useAuth } from "../context/auth-context"

export function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm border-b border-border/40">
      <div className="container flex items-center justify-between h-12 px-4">
        {isLoggedIn && (
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white">
            Logout
          </button>
        )}
      </div>
    </header>
  )
} 