import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corrections Policy | Political Aficionado',
  description: 'How Political Aficionado handles corrections, clarifications, and updates to our published content.',
};

export default function CorrectionsPolicyPage() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">Corrections Policy</h1>
        <p className="text-center text-gray-500 text-sm mb-12">Our commitment to accuracy and accountability</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">Our Commitment to Accuracy</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At Political Aficionado, we are committed to the highest standards of accuracy. When we make mistakes, we correct them promptly and transparently. We believe that acknowledging and fixing errors is essential to maintaining the trust of our readers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Types of Corrections</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Corrections</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            A correction is issued when we have published factually inaccurate information. Corrections are made directly in the article with a note at the bottom explaining what was changed and when. The original error is not deleted but is struck through when appropriate.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Clarifications</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            A clarification is issued when our original reporting was accurate but may have been unclear or could be misinterpreted. We add additional context or explanation to ensure readers fully understand the information presented.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Updates</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Updates are added to stories when significant new information becomes available after publication. Updates are clearly dated and marked within the article.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Editor's Notes</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Editor's notes are used to provide additional context, disclose conflicts of interest, or address other matters that require transparency with our readers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">How We Handle Corrections</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Corrections are made as soon as an error is verified</li>
            <li>A correction note is added to the article specifying what was corrected</li>
            <li>The date and time of the correction are recorded</li>
            <li>For significant errors, we may publish a standalone correction article</li>
            <li>Social media posts containing errors are corrected or deleted with a new accurate post</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Report an Error</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            If you believe we have published inaccurate information, please let us know. We take all reports seriously and will investigate promptly. To report an error, please include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>The headline and URL of the article in question</li>
            <li>A description of the error</li>
            <li>Any supporting documentation or sources</li>
            <li>Your contact information (optional, but helpful for follow-up)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            To report an error or request a correction, please email us at{' '}
            <a href="mailto:corrections@politicalaficionado.com" className="text-accent hover:underline">
              corrections@politicalaficionado.com
            </a>
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Recent Corrections</h2>
            <p className="text-gray-500 italic">
              No corrections have been issued recently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
