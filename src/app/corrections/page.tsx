import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corrections Policy | Political Aficionado',
  description: 'How Political Aficionado handles corrections, clarifications, and updates to our published content.',
};

export default function CorrectionsPolicyPage() {
  return (
    <section>
      <h1>Corrections Policy</h1>
      <p>Our commitment to accuracy and accountability</p>

      <h2>Our Commitment to Accuracy</h2>
      <p>At Political Aficionado, we are committed to the highest standards of accuracy. When we make mistakes, we correct them promptly and transparently. We believe that acknowledging and fixing errors is essential to maintaining the trust of our readers.</p>

      <h2>Types of Corrections</h2>

      <h3>Corrections</h3>
      <p>A correction is issued when we have published factually inaccurate information. Corrections are made directly in the article with a note at the bottom explaining what was changed and when. The original error is not deleted but is struck through when appropriate.</p>

      <h3>Clarifications</h3>
      <p>A clarification is issued when our original reporting was accurate but may have been unclear or could be misinterpreted. We add additional context or explanation to ensure readers fully understand the information presented.</p>

      <h3>Updates</h3>
      <p>Updates are added to stories when significant new information becomes available after publication. Updates are clearly dated and marked within the article.</p>

      <h3>Editor&apos;s Notes</h3>
      <p>Editor&apos;s notes are used to provide additional context, disclose conflicts of interest, or address other matters that require transparency with our readers.</p>

      <h2>How We Handle Corrections</h2>
      <ul>
        <li>Corrections are made as soon as an error is verified</li>
        <li>A correction note is added to the article specifying what was corrected</li>
        <li>The date and time of the correction are recorded</li>
        <li>For significant errors, we may publish a standalone correction article</li>
        <li>Social media posts containing errors are corrected or deleted with a new accurate post</li>
      </ul>

      <h2>Report an Error</h2>
      <p>If you believe we have published inaccurate information, please let us know. We take all reports seriously and will investigate promptly. To report an error, please include:</p>
      <ul>
        <li>The headline and URL of the article in question</li>
        <li>A description of the error</li>
        <li>Any supporting documentation or sources</li>
        <li>Your contact information (optional, but helpful for follow-up)</li>
      </ul>

      <h2>Contact Us</h2>
      <p>To report an error or request a correction, please email us at <a href="mailto:corrections@politicalaficionado.com">corrections@politicalaficionado.com</a></p>

      <div>
        <h2>Recent Corrections</h2>
        <p>No corrections have been issued recently.</p>
      </div>
    </section>
  );
}
