import { motion } from 'framer-motion';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />
        
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="mb-8"
            >
              <span className="text-8xl md:text-9xl font-display font-bold gradient-text">404</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Page Not Found
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
            >
              Oops! The page you're looking for doesn't exist or has been moved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="h-5 w-5" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                <span className="cursor-pointer">
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>
    </PageTransition>
  );
};

export default NotFound;
