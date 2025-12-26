import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { PageTransition, staggerContainer, staggerItem } from '@/components/layout/PageTransition';
import { useTheme } from '@/hooks/useTheme';
import { Mail, Sparkles } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export default function Contact() {
  const { theme, setTheme } = useTheme();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col pb-24 md:pb-28">
        <div className="floating-gradient" />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center md:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Get in Touch</span>
              </motion.div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold">Contact <span className="gradient-text">Us</span></h1>
                  <p className="text-muted-foreground mt-1">We'd love to hear from you</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Contact Form */}
              <motion.div variants={staggerItem} className="glass-card p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
                <p className="text-muted-foreground mb-6">
                  Have a question, suggestion, or feedback? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <ContactForm />
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={staggerItem} className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">📧 Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:support@timerflow.app" className="text-primary hover:underline">
                        support@timerflow.app
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">⏰ Response Time</h3>
                    <p className="text-muted-foreground">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">🌐 Website</h3>
                    <p className="text-muted-foreground">
                      <a href="/" className="text-primary hover:underline">
                        timerflow.app
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">FAQ</h2>
                <p className="text-muted-foreground mb-4">
                  Before reaching out, you might find answers to common questions on our FAQ page.
                </p>
                <a
                  href="/#faq"
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  Visit FAQ Section →
                </a>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Report Issues</h2>
                <p className="text-muted-foreground mb-4">
                  Encountered a bug or technical issue? Please include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Browser and version</li>
                  <li>Device type (desktop/mobile)</li>
                  <li>Steps to reproduce the issue</li>
                  <li>Screenshots if applicable</li>
                </ul>
              </div>

              <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <h2 className="text-xl font-bold mb-2">Feature Requests</h2>
                <p className="text-muted-foreground text-sm">
                  We love hearing your ideas! Share your feature requests and help us make TimerFlow even better.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Additional Information */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <motion.div variants={staggerItem} className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Have ideas for new features or improvements?
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">🐛</div>
              <h3 className="font-semibold mb-2">Bug Reports</h3>
              <p className="text-sm text-muted-foreground">
                Found a problem? Let us know so we can fix it!
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">Partnerships</h3>
              <p className="text-sm text-muted-foreground">
                Interested in collaborating or advertising?
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
      
      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
    </PageTransition>
  );
}
