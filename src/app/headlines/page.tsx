import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-white min-h-screen max-w-lg mx-auto pb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <Link href="/" className="w-9 h-9 flex items-center justify-center -ml-1">
          <svg className="w-[22px] h-[22px] text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-[17px] font-bold text-gray-900">Latest News</h1>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-[20px] h-[20px] text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-[20px] h-[20px] text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h12M3 17h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Featured Article */}
      <div className="px-4 mt-2 mb-5">
        <div className="relative">
          <div className="w-full h-[216px] bg-[#c8c8c8] rounded-xl flex items-center justify-center relative">
            <span className="text-gray-500/60 text-[32px] font-light tracking-wider">343 x 216</span>
            <button className="absolute top-3 right-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[13px] font-medium text-gray-500 mt-3 mb-1">Business</p>
        <h2 className="text-[18px] font-bold text-gray-900 leading-snug mb-2.5">
          Workers must risk infection or losing unemployment payments
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#d8d8d8] flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-[7px]">32 x 32</span>
          </div>
          <span className="text-[12px] font-medium text-gray-700">Angel Franciosi</span>
          <span className="text-[12px] text-gray-400">· 18m ago ·</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
            <span className="text-[12px] text-gray-400">64</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* News List Item 1 */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-gray-500 mb-1">International</p>
            <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-2">
              As states reopen, workers forced to choose between health and livelihood
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400">Good News</span>
              <span className="text-[11px] text-gray-400">· 16m ago ·</span>
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
              <span className="text-[11px] text-gray-400">73</span>
              <div className="ml-auto flex items-center gap-3">
                <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <button className="p-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-[80px] h-[80px] bg-[#d8d8d8] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
            <span className="text-gray-400 text-[10px]">80 x 80</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Quote Card */}
      <div className="px-4 py-4">
        <div className="border-l-[3px] border-teal pl-4 py-1">
          <p className="text-[12px] font-medium text-gray-500 mb-2">Business</p>
          <p className="text-[16px] text-gray-800 leading-relaxed mb-3">
            &ldquo;Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.&rdquo;
          </p>
          <p className="text-[13px]">
            <span className="font-semibold text-gray-900">Albert Schweitzer</span>
            <span className="text-gray-400">, Theologian &amp; philosopher</span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* News List Item 2 */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-gray-500 mb-1">Business</p>
            <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-2">
              Crowds gathered at National Mall to watch Blue Angels, Thunderbirds flyover
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400">Fernando Agaro</span>
              <span className="text-[11px] text-gray-400">· 18m ago ·</span>
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
              <span className="text-[11px] text-gray-400">892</span>
              <div className="ml-auto flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <button className="p-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-[80px] h-[80px] bg-[#d8d8d8] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
            <span className="text-gray-400 text-[10px]">80 x 80</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* News List Item 3 */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-gray-500 mb-1">Fashion</p>
            <h3 className="text-[16px] font-bold text-gray-900 leading-snug mb-2">
              Confused about delaying your mortgage payments? You&apos;re not alone bro
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-400">Cool News</span>
              <span className="text-[11px] text-gray-400">· 24m ago ·</span>
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
              <span className="text-[11px] text-gray-400">91</span>
              <div className="ml-auto flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <button className="p-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-[80px] h-[80px] bg-[#d8d8d8] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
            <span className="text-gray-400 text-[10px]">80 x 80</span>
          </div>
        </div>
      </div>
    </div>
  );
}
