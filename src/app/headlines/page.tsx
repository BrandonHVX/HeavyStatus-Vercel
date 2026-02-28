import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    search?: string;
    categories?: string;
    after?: string;
    before?: string;
  }>;
};

export default async function HeadlinesRedirect({ searchParams }: Props) {
  const params = await searchParams;
  const queryParts: string[] = [];
  if (params.search) queryParts.push(`search=${params.search}`);
  if (params.categories) queryParts.push(`categories=${params.categories}`);
  if (params.after) queryParts.push(`after=${params.after}`);
  if (params.before) queryParts.push(`before=${params.before}`);
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  redirect(`/${query}`);
}
