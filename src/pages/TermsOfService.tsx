import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTheme } from '@/hooks/useTheme';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onThemeChange={setTheme} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold">Terms of Service</h1>
              <p className="text-muted-foreground mt-1">Last Updated: December 2, 2025</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using TimerFlow ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these Terms of Service, please do not use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TimerFlow is a free web-based productivity tool that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Countdown timer functionality</li>
                <li>Pomodoro technique timer</li>
                <li>Stopwatch features</li>
                <li>Preset timer configurations</li>
                <li>Sound alerts and notifications</li>
                <li>Theme customization</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                The Service is provided "as is" without any guarantees or warranties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We grant you a limited, non-exclusive, non-transferable license to access and use TimerFlow for personal, non-commercial purposes. This license does not include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modifying or copying the Service's materials</li>
                <li>Using the materials for commercial purposes</li>
                <li>Attempting to reverse engineer any software contained on the Service</li>
                <li>Removing any copyright or proprietary notations</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree to use the Service only for lawful purposes. You are prohibited from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Using the Service in any way that violates any applicable law or regulation</li>
                <li>Attempting to interfere with the proper functioning of the Service</li>
                <li>Engaging in any automated use of the system (bots, scrapers, etc.)</li>
                <li>Circumventing, disabling, or interfering with security features</li>
                <li>Using the Service to transmit any harmful code or malware</li>
                <li>Attempting to gain unauthorized access to the Service or related systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. User Data and Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Your use of the Service is also governed by our Privacy Policy. Key points:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Timer settings are stored locally in your browser</li>
                <li>We use cookies for essential functionality and analytics</li>
                <li>Third-party services (Google AdSense, Analytics) may collect data</li>
                <li>You can control cookie preferences through our cookie consent banner</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Please review our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> for detailed information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Third-Party Services and Advertising</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TimerFlow displays advertisements through Google AdSense and may use other third-party services. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We do not control the content of third-party advertisements</li>
                <li>Third parties may use cookies and tracking technologies</li>
                <li>Clicking on ads is at your own risk</li>
                <li>We are not responsible for third-party websites or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of TimerFlow, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of TimerFlow and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Implied warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy, reliability, or completeness of the Service</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We do not guarantee that the Service will meet your requirements or that any errors will be corrected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TO THE FULLEST EXTENT PERMITTED BY LAW, TIMERFLOW SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or use</li>
                <li>Damage to your computer or device</li>
                <li>Any reliance on information obtained through the Service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                This applies whether based on warranty, contract, tort, or any other legal theory, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to defend, indemnify, and hold harmless TimerFlow and its affiliates from any claims, damages, obligations, losses, liabilities, costs, or expenses arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any harmful content you may submit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the Service after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TimerFlow operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be replaced with a valid provision that most closely approximates the intent of the original provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and TimerFlow regarding the use of the Service and supersede any prior agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> legal@timerflow.app</li>
                <li><strong>Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a></li>
              </ul>
            </section>

            <section className="bg-muted/50 p-6 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                By using TimerFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
