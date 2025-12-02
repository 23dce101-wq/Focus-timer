import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/hooks/useTheme';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onThemeChange={setTheme} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">Last Updated: December 2, 2025</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to TimerFlow ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This policy outlines our practices concerning the collection, use, and disclosure of your information when you use our online timer service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Information You Provide</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We do not require registration or personal information to use our timer service. However, if you contact us, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address (if you contact us)</li>
                <li>Any information you voluntarily provide in correspondence</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you visit our website, we automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TimerFlow uses browser local storage to save your preferences and timer settings on your device. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Theme preference (light/dark mode)</li>
                <li>Timer settings and presets</li>
                <li>Sound preferences</li>
                <li>Pomodoro configuration</li>
                <li>Cookie consent preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                This data is stored locally on your device and is not transmitted to our servers. You can clear this data at any time through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to remember your preferences and provide basic functionality. These cookies are necessary for the website to function properly.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may use Google Analytics or similar services to understand how visitors use our site. These services may use cookies to collect anonymous information such as page views, session duration, and user interactions.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Advertising Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use Google AdSense to display advertisements on our website. Google and its partners may use cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Display personalized ads based on your browsing history</li>
                <li>Measure ad performance</li>
                <li>Prevent fraudulent clicks</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a> or <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aboutads.info</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our timer service</li>
                <li>Improve and optimize our website</li>
                <li>Analyze usage patterns and trends</li>
                <li>Display relevant advertisements</li>
                <li>Respond to inquiries and provide support</li>
                <li>Detect and prevent technical issues or fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may share information with third-party service providers who assist us in operating our website:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                <li><strong>Google Analytics:</strong> For analyzing website traffic</li>
                <li><strong>Hosting Providers:</strong> For website infrastructure</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                These third parties have access to your information only to perform specific tasks on our behalf and are obligated to protect it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights (GDPR & CCPA)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are located in the European Economic Area (EEA) or California, you have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of the information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information</li>
                <li><strong>Opt-Out:</strong> Opt out of personalized advertising</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> privacy@timerflow.app</li>
                <li><strong>Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a></li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
