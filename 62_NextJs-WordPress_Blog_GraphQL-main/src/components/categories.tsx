import { Category } from "@/lib/types"
import Link from "next/link";

export function Categories({ categories }:{categories: Category[]}){
  return (
    <section className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ul className="flex gap-4 flex-wrap items-center justify-center md:justify-start">
          <li className="flex-shrink-0">
            <Link 
              href="/blog"
              className="text-white hover:text-accent transition-colors text-sm font-medium uppercase tracking-wide"
            >
              All
            </Link>
          </li>
          {categories.map((category: Category) => (
            <li key={category.id} className="flex-shrink-0">
              <Link 
                href={`/blog?categories=${category.slug}`}
                className="text-gray-300 hover:text-accent transition-colors text-sm font-medium uppercase tracking-wide"
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
