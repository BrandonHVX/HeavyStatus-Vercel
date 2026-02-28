import { Category } from "@/lib/types"
import Link from "next/link";

export function Categories({ categories }:{categories: Category[]}){
  return (
    <nav>
      <Link href="/">All</Link>
      {categories.slice(0, 10).map((category: Category) => (
        <Link key={category.id} href={`/?categories=${category.slug}`}>
          {category.name}
        </Link>
      ))}
    </nav>
  )
}
