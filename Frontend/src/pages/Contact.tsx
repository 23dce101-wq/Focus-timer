import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/hooks/useTheme';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call in production)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onThemeChange={setTheme} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold">Contact Us</h1>
              <p className="text-muted-foreground mt-1">We'd love to hear from you</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Have a question, suggestion, or feedback? Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your message about?"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
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
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Have ideas for new features or improvements?
              </p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">🐛</div>
              <h3 className="font-semibold mb-2">Bug Reports</h3>
              <p className="text-sm text-muted-foreground">
                Found a problem? Let us know so we can fix it!
              </p>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">Partnerships</h3>
              <p className="text-sm text-muted-foreground">
                Interested in collaborating or advertising?
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
