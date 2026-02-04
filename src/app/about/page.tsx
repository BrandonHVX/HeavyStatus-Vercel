import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Political Aficionado',
  description: 'Political Aficionado is an independent digital publication covering politics, policy, and power with depth, clarity, and editorial integrity.',
  openGraph: {
    title: 'About Us | Political Aficionado',
    description: 'Political Aficionado is an independent digital publication covering politics, policy, and power with depth, clarity, and editorial integrity.',
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">About Political Aficionado</h1>
      
      <section className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Political Aficionado is an independent digital publication dedicated to covering politics, policy, and the people who shape our world. We deliver insightful analysis, breaking news, and in-depth features with editorial integrity and journalistic excellence.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          We believe that informed citizens are the foundation of a healthy democracy. Our mission is to provide readers with the context, analysis, and reporting they need to understand the complex political landscape—from local government to global affairs.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          We are committed to accuracy, fairness, and independence. We do not shy away from holding power accountable, asking tough questions, and following the story wherever it leads.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">What We Cover</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
          <li><strong>Politics & Elections</strong> — Campaign coverage, voting rights, and electoral analysis</li>
          <li><strong>Policy & Government</strong> — Legislation, regulation, and executive action</li>
          <li><strong>International Affairs</strong> — Diplomacy, global conflicts, and foreign policy</li>
          <li><strong>Economy & Business</strong> — How policy impacts markets, jobs, and everyday Americans</li>
          <li><strong>Culture & Society</strong> — The intersection of politics with culture, media, and public life</li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Editorial Standards</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          We adhere to the highest standards of journalism. Our reporting is fact-checked, sourced, and reviewed before publication. We clearly distinguish between news reporting and opinion content. When we make errors, we correct them promptly and transparently.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Read our full <Link href="/editorial-policy" className="text-red-600 hover:underline">Editorial Policy</Link> and <Link href="/corrections" className="text-red-600 hover:underline">Corrections Policy</Link> for more information.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Contact Us</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Have a news tip, story idea, or feedback? We want to hear from you.
        </p>
        <ul className="list-none text-gray-700 space-y-2 mb-6">
          <li><strong>General Inquiries:</strong> <a href="mailto:info@politicalaficionado.com" className="text-red-600 hover:underline">info@politicalaficionado.com</a></li>
          <li><strong>News Tips:</strong> <a href="mailto:tips@politicalaficionado.com" className="text-red-600 hover:underline">tips@politicalaficionado.com</a></li>
          <li><strong>Corrections:</strong> <a href="mailto:corrections@politicalaficionado.com" className="text-red-600 hover:underline">corrections@politicalaficionado.com</a></li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Subscribe</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Support independent journalism and get unlimited access to all our content with a <Link href="/subscribe" className="text-red-600 hover:underline">Political Aficionado subscription</Link>.
        </p>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-gray-500">
            Political Aficionado is committed to transparency. For information about our ownership, funding, and advertising policies, please <Link href="/contact" className="text-red-600 hover:underline">contact us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
