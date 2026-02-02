export default function Page() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-12">About</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center font-serif italic">
            Your trusted source for the latest news and insights.
          </p>
          
          <div className="border-t border-gray-200 pt-10 mt-10">
            <p className="text-gray-600 leading-relaxed mb-6">
              Welcome to Political Aficionado. We are committed to delivering quality journalism and in-depth analysis on topics that matter most to you.
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform leverages cutting-edge technology to bring you a fast, modern reading experience. Built with Next.js and powered by WordPress, we combine the best of both worlds: robust content management with a lightning-fast frontend.
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you are looking for breaking news, thought-provoking opinion pieces, or comprehensive coverage of current events, Political Aficionado is here to keep you informed.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-10 mt-10">
            <h2 className="text-xs uppercase tracking-widest font-semibold mb-8 text-center">Our Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="font-serif text-lg mb-1">Next.js 15</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Frontend</p>
              </div>
              <div>
                <p className="font-serif text-lg mb-1">WordPress</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">CMS</p>
              </div>
              <div>
                <p className="font-serif text-lg mb-1">GraphQL</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">API</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
