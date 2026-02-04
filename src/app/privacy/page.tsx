import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Political Aficionado',
  description: 'Learn how Political Aficionado collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Privacy Policy</h1>
        <p className="text-center text-gray-500 text-sm mb-12">Last updated: February 4, 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you visit Political Aficionado, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, and payment information when you create an account or subscribe to our services.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referring sources.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
            <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze site traffic.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process subscriptions and payments</li>
            <li>Send you newsletters and updates (with your consent)</li>
            <li>Analyze and improve our content and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, or analyzing data. These providers are contractually obligated to protect your information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We use essential cookies to ensure our website functions properly, analytics cookies to understand how visitors interact with our site, and advertising cookies to deliver relevant advertisements. You can manage your cookie preferences through your browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@politicalaficionado.com" className="text-accent hover:underline">
              privacy@politicalaficionado.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
