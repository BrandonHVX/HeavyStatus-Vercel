import { NextResponse } from 'next/server';
import { gql, GraphQLClient } from 'graphql-request';

const baseUrl = process.env.WORDPRESS_URL || 'https://heavy-status.com';
const client = new GraphQLClient(`${baseUrl}/graphql`);

export async function GET() {
  try {
    const query = gql`
      query GetTopics {
        categories(first: 20) {
          nodes {
            id
            name
            slug
            count
          }
        }
        tags(first: 30) {
          nodes {
            id
            name
            slug
            count
          }
        }
      }
    `;

    const data = await client.request<{
      categories: { nodes: Array<{ id: string; name: string; slug: string; count?: number }> };
      tags: { nodes: Array<{ id: string; name: string; slug: string; count?: number }> };
    }>(query);

    const categories = data.categories.nodes.filter(c => c.count && c.count > 0);
    const tags = data.tags.nodes.filter(t => t.count && t.count > 0);

    return NextResponse.json({
      categories,
      tags,
    });
  } catch (error) {
    console.error('Topics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics', categories: [], tags: [] },
      { status: 500 }
    );
  }
}
