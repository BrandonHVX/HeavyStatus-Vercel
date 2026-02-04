import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Policy | Political Aficionado',
  description: 'Our commitment to accurate, fair, and independent journalism at Political Aficionado.',
};

export default function EditorialPolicyPage() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Editorial Policy</h1>
        <p className="text-center text-gray-500 text-sm mb-12">Our commitment to journalistic integrity</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Political Aficionado is committed to providing accurate, fair, and independent journalism. We believe in the power of informed citizens and the essential role that quality journalism plays in a democratic society.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Editorial Independence</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our editorial decisions are made independently and are not influenced by advertisers, sponsors, or any external parties. Our news coverage is separate from our business operations, ensuring that commercial interests never compromise our journalism.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Accuracy and Fact-Checking</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We are committed to accuracy in all our reporting. Our standards include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Verifying information through multiple sources before publication</li>
            <li>Clearly distinguishing between news, analysis, and opinion content</li>
            <li>Providing context and background to help readers understand complex issues</li>
            <li>Correcting errors promptly and transparently</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Fairness and Balance</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We strive to present all sides of a story fairly. When covering controversial topics, we seek out diverse perspectives and give subjects of critical coverage the opportunity to respond. We do not engage in advocacy journalism in our news coverage.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Transparency</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We believe in being transparent with our readers about:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Our sources and how we obtained information</li>
            <li>Any potential conflicts of interest</li>
            <li>The difference between news reporting and sponsored content</li>
            <li>Our ownership structure and funding sources</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Source Protection</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We protect the confidentiality of sources who request anonymity. However, we verify the credibility and motivation of anonymous sources, and we use anonymous sourcing sparingly and only when the information is vital to the public interest.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Plagiarism and Attribution</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We do not tolerate plagiarism. All original reporting, quotes, and ideas from other sources are properly attributed. We respect intellectual property rights and follow fair use guidelines.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Sponsored Content</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Any sponsored or paid content is clearly labeled as such. Sponsored content is never presented as editorial content, and our editorial team does not participate in creating sponsored material.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Social Media Guidelines</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our staff members are expected to maintain professional standards on social media. Personal opinions expressed on social media do not represent the views of Political Aficionado.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Our Editorial Team</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If you have questions about our editorial policies or want to report a concern, please contact us at{' '}
            <a href="mailto:editorial@politicalaficionado.com" className="text-accent hover:underline">
              editorial@politicalaficionado.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
