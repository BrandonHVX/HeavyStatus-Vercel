import { Category } from "@/lib/types"
import Link from "next/link";

export function Categories({ categories }:{categories: Category[]}){
  return (
    <div className="mb-8">
      <ul className="text-[0.7rem] uppercase flex gap-2 flex-wrap">
        {categories.map((category: Category) => (
          <li key={category.id} className="flex flex-shrink-0">
            <Link href={`/blog?categories=${category.slug}`}
            className="hover:underline border p-1 rounded-md">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}