import type { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

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
    <main>
      <BackButton />
      <h1>About Political Aficionado</h1>

      <p>
        Political Aficionado is an independent digital publication dedicated to covering politics, policy, and the people who shape our world. We deliver insightful analysis, breaking news, and in-depth features with editorial integrity and journalistic excellence.
      </p>

      <h2>Our Mission</h2>
      <p>
        We believe that informed citizens are the foundation of a healthy democracy. Our mission is to provide readers with the context, analysis, and reporting they need to understand the complex political landscape—from local government to global affairs.
      </p>
      <p>
        We are committed to accuracy, fairness, and independence. We do not shy away from holding power accountable, asking tough questions, and following the story wherever it leads.
      </p>

      <h2>What We Cover</h2>
      <ul>
        <li><strong>Politics & Elections</strong> — Campaign coverage, voting rights, and electoral analysis</li>
        <li><strong>Policy & Government</strong> — Legislation, regulation, and executive action</li>
        <li><strong>International Affairs</strong> — Diplomacy, global conflicts, and foreign policy</li>
        <li><strong>Economy & Business</strong> — How policy impacts markets, jobs, and everyday Americans</li>
        <li><strong>Culture & Society</strong> — The intersection of politics with culture, media, and public life</li>
      </ul>

      <h2>Editorial Standards</h2>
      <p>
        We adhere to the highest standards of journalism. Our reporting is fact-checked, sourced, and reviewed before publication. We clearly distinguish between news reporting and opinion content. When we make errors, we correct them promptly and transparently.
      </p>
      <p>
        Read our full <Link href="/editorial-policy">Editorial Policy</Link> and <Link href="/corrections">Corrections Policy</Link> for more information.
      </p>

      <h2>Contact Us</h2>
      <p>Have a news tip, story idea, or feedback? We want to hear from you.</p>
      <ul>
        <li><strong>General Inquiries:</strong> <a href="mailto:info@politicalaficionado.com">info@politicalaficionado.com</a></li>
        <li><strong>News Tips:</strong> <a href="mailto:tips@politicalaficionado.com">tips@politicalaficionado.com</a></li>
        <li><strong>Corrections:</strong> <a href="mailto:corrections@politicalaficionado.com">corrections@politicalaficionado.com</a></li>
      </ul>

      <h2>Subscribe</h2>
      <p>
        Support independent journalism and get unlimited access to all our content with a <Link href="/subscribe">Political Aficionado subscription</Link>.
      </p>

      <p>
        Political Aficionado is committed to transparency. For information about our ownership, funding, and advertising policies, please <Link href="/contact">contact us</Link>.
      </p>
    </main>
  );
}
