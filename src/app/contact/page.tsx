export default function Page() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-8">Contact</h1>
        
        <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
          We would love to hear from you. Whether you have a question, feedback, or just want to say hello, feel free to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16 border-y border-gray-200 py-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Address</p>
            <p className="font-serif">London, UK</p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</p>
            <p className="font-serif">+44 (0) 555 5555</p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Email</p>
            <a href="mailto:contact@heavy-status.com" className="font-serif hover:text-accent transition-colors">
              hello@heavystatus.com
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-8 text-center">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder=""
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                placeholder=""
              ></textarea>
            </div>
            <div className="text-center pt-4">
              <button 
                type="submit"
                className="text-xs uppercase tracking-widest text-black border border-black px-10 py-3 hover:bg-black hover:text-white transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
