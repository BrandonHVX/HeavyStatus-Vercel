import BackButton from '@/components/BackButton';

export default function Page() {
  return (
    <section>
      <BackButton />
      <h1>Contact</h1>

      <p>We would love to hear from you. Whether you have a question, feedback, or just want to say hello, feel free to reach out.</p>

      <div>
        <div>
          <p>Address</p>
          <p>London, UK</p>
        </div>
        <div>
          <p>Phone</p>
          <p>+44 (0) 555 5555</p>
        </div>
        <div>
          <p>Email</p>
          <a href="mailto:contact@heavy-status.com">hello@heavystatus.com</a>
        </div>
      </div>

      <div>
        <h2>Send a Message</h2>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
          </div>
          <div>
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={5}></textarea>
          </div>
          <div>
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </section>
  )
}
