import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Political Aficionado',
  description: 'Learn how Political Aficionado collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section>
      <h1>Privacy Policy</h1>
      <p>Last updated: February 4, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>When you visit Political Aficionado, we may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, and payment information when you create an account or subscribe to our services.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring sources.</li>
        <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
        <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze site traffic.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Process subscriptions and payments</li>
        <li>Send you newsletters and updates (with your consent)</li>
        <li>Analyze and improve our content and user experience</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, or analyzing data. These providers are contractually obligated to protect your information.</p>

      <h2>4. Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and receive a copy of your personal data</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal data</li>
        <li>Opt out of marketing communications</li>
        <li>Withdraw consent where processing is based on consent</li>
      </ul>

      <h2>6. Cookies Policy</h2>
      <p>We use essential cookies to ensure our website functions properly, analytics cookies to understand how visitors interact with our site, and advertising cookies to deliver relevant advertisements. You can manage your cookie preferences through your browser settings.</p>

      <h2>7. Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>

      <h2>10. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@politicalaficionado.com">privacy@politicalaficionado.com</a></p>
    </section>
  );
}
