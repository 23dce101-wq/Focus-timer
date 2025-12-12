import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Moon, Sun, Monitor, LogOut, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SoundSelector } from '@/components/SoundSelector';
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog';
import { useAuth } from '@/contexts/AuthContext';
import type { Theme } from '@/hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function Header({ theme, onThemeChange }: HeaderProps) {
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== 'string') {
      return '?';
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return '?';
    }

    return parts
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="glassmorphism-header sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="nav-logo-bubble flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Timer className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg md:text-xl font-bold gradient-text tracking-tight">
              TimerFlow
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className="nav-bubble-link relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300">
            Timer
          </Link>
          <Link to="/habits" className="nav-bubble-link relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300">
            Habits
          </Link>
          <Link to="/about" className="nav-bubble-link relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300">
            About
          </Link>
          <a href="/#how-to-use" className="nav-bubble-link relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300">
            How to Use
          </a>
          <Link to="/contact" className="nav-bubble-link relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="hidden sm:block">
            <KeyboardShortcutsDialog />
          </div>
          <SoundSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="nav-icon-bubble rounded-full hover:scale-110 transition-transform duration-300">
                <ThemeIcon className="h-5 w-5" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onThemeChange('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onThemeChange('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onThemeChange('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="nav-icon-bubble rounded-full hover:scale-110 transition-transform duration-300">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="inline-flex">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile navigation toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="nav-icon-bubble rounded-full hover:scale-110 transition-transform duration-300 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container mx-auto px-3 py-3 space-y-1.5">
            <Link
              to="/"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Timer
            </Link>
            <Link
              to="/habits"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Habits
            </Link>
            <Link
              to="/about"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <a
              href="/#how-to-use"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How to Use
            </a>
            <Link
              to="/contact"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {!isAuthenticated && (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="ghost" size="sm" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
