import { Category } from "@/lib/types"
import Link from "next/link";

export function Categories({ categories }:{categories: Category[]}){
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ul className="flex gap-6 flex-wrap items-center justify-center overflow-x-auto scrollbar-hide">
          <li className="flex-shrink-0">
            <Link 
              href="/blog"
              className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-accent transition-colors font-semibold"
            >
              All
            </Link>
          </li>
          {categories.slice(0, 10).map((category: Category) => (
            <li key={category.id} className="flex-shrink-0">
              <Link 
                href={`/blog?categories=${category.slug}`}
                className="text-[11px] uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
