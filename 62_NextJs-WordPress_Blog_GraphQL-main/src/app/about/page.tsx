export default function Page() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">About Us</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Welcome to Heavy Status — your trusted source for the latest news and insights. We are committed to delivering quality journalism and in-depth analysis on topics that matter most to you.
          </p>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Our platform leverages cutting-edge technology to bring you a fast, modern reading experience. Built with Next.js and powered by WordPress, we combine the best of both worlds: robust content management with a lightning-fast frontend.
          </p>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Whether you are looking for breaking news, thought-provoking opinion pieces, or comprehensive coverage of current events, Heavy Status is here to keep you informed.
          </p>

          <div className="bg-gray-50 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Our Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Next.js 15</h3>
                <p className="text-gray-600 text-sm">Lightning-fast performance with server-side rendering</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
                <p className="text-gray-600 text-sm">Modern, responsive design system</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WordPress GraphQL</h3>
                <p className="text-gray-600 text-sm">Powerful content management via API</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
