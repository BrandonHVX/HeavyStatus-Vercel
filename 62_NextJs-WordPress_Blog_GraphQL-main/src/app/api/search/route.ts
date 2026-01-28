import { NextRequest, NextResponse } from 'next/server';
import { gql, GraphQLClient } from 'graphql-request';

const baseUrl = process.env.WORDPRESS_URL || 'https://heavy-status.com';
const client = new GraphQLClient(`${baseUrl}/graphql`);

interface SearchResult {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    featuredImage?: {
      node?: {
        sourceUrl?: string;
      };
    };
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    count?: number;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    count?: number;
  }>;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ posts: [], categories: [], tags: [] });
  }

  try {
    const searchQuery = gql`
      query Search($search: String!) {
        posts(first: 5, where: { search: $search }) {
          nodes {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
        categories(first: 5, where: { search: $search }) {
          nodes {
            id
            name
            slug
            count
          }
        }
        tags(first: 5, where: { search: $search }) {
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
      posts: { nodes: SearchResult['posts'] };
      categories: { nodes: SearchResult['categories'] };
      tags: { nodes: SearchResult['tags'] };
    }>(searchQuery, { search: query });

    return NextResponse.json({
      posts: data.posts.nodes,
      categories: data.categories.nodes,
      tags: data.tags.nodes,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search', posts: [], categories: [], tags: [] },
      { status: 500 }
    );
  }
}
