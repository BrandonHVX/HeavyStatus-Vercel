import { getAllPosts, getCategories } from "@/lib/queries";
import { LatestPosts } from "@/components/latest-posts";
import { Categories } from "@/components/categories";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{
    search?: string;
    categories?: string;
    after?: string;
    before?: string;
  }>;
};

export default async function HeadlinesPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchTerm = params.search || '';
  const category = params.categories || '';

  const [{ posts, pageInfo }, categories] = await Promise.all([
    getAllPosts(searchTerm, category, {
      after: params.after || null,
      before: params.before || null,
    }),
    getCategories(),
  ]);

  return (
    <div>
      <h1>Headlines</h1>
      <Categories categories={categories} />
      <LatestPosts
        posts={posts}
        searchTerm={searchTerm}
        pageInfo={pageInfo}
        category={category}
      />
    </div>
  );
}
