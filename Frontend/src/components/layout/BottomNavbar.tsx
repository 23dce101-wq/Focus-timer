import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Timer, Target, Info, Mail, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/timer', icon: Timer, label: 'Timer' },
  { path: '/habits', icon: Target, label: 'Habits' },
  { path: '/about', icon: Info, label: 'About' },
  { path: '/contact', icon: Mail, label: 'Contact' },
];

const navVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

const glowVariants = {
  inactive: {
    scale: 0,
    opacity: 0,
  },
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

interface NavItemProps {
  path: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavItem({ path, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <motion.div variants={itemVariants} className="relative">
      <Link
        to={path}
        className={cn(
          'bottom-nav-item relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300',
          isActive 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {/* Active Background Glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              variants={glowVariants}
              initial="inactive"
              animate="active"
              exit="inactive"
              className="absolute inset-0 bg-primary/10 rounded-xl"
            />
          )}
        </AnimatePresence>

        {/* Active Indicator Dot */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute -top-1 w-1.5 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/50"
            />
          )}
        </AnimatePresence>

        {/* Icon with hover effect */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10"
        >
          <Icon className={cn(
            'h-5 w-5 md:h-6 md:w-6 transition-all duration-300',
            isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]'
          )} />
        </motion.div>

        {/* Label */}
        <span className={cn(
          'text-[10px] md:text-xs font-medium mt-1 transition-all duration-300 relative z-10',
          isActive && 'text-primary'
        )}>
          {label}
        </span>
      </Link>
    </motion.div>
  );
}

export function BottomNavbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Determine current path for active state
  const currentPath = location.pathname;

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="bottom-navbar fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bottom-navbar-glass flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-3 rounded-2xl md:rounded-3xl">
        {/* Main Nav Items */}
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            isActive={
              item.path === '/' 
                ? currentPath === '/' 
                : currentPath.startsWith(item.path)
            }
          />
        ))}

        {/* Divider */}
        <div className="w-px h-8 bg-border/50 mx-1 md:mx-2" />

        {/* Auth Button */}
        <motion.div variants={itemVariants}>
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={cn(
                'bottom-nav-item relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300',
                currentPath === '/profile'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <AnimatePresence>
                {currentPath === '/profile' && (
                  <motion.div
                    variants={glowVariants}
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                  />
                )}
              </AnimatePresence>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                <User className={cn(
                  'h-5 w-5 md:h-6 md:w-6 transition-all duration-300',
                  currentPath === '/profile' && 'drop-shadow-[0_0_8px_hsl(var(--primary))]'
                )} />
              </motion.div>
              <span className="text-[10px] md:text-xs font-medium mt-1 relative z-10">Profile</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={cn(
                'bottom-nav-item relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300',
                currentPath === '/login'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <AnimatePresence>
                {currentPath === '/login' && (
                  <motion.div
                    variants={glowVariants}
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                  />
                )}
              </AnimatePresence>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                <LogIn className={cn(
                  'h-5 w-5 md:h-6 md:w-6 transition-all duration-300',
                  currentPath === '/login' && 'drop-shadow-[0_0_8px_hsl(var(--primary))]'
                )} />
              </motion.div>
              <span className="text-[10px] md:text-xs font-medium mt-1 relative z-10">Login</span>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
