const baseUrl = process.env.WORDPRESS_URL || 'https://heavy-status.com';
import { gql, GraphQLClient } from 'graphql-request';
import { Category, Post } from '@/lib/types';

const client = new GraphQLClient(`${baseUrl}/graphql`);

export async function getCategories(): Promise<Category[]> {
  const query = gql`
  query getCategories {
    categories(first: 100) {
      nodes {
        id
        name
        slug
      }
    }
  }
  `;

  const data: { categories: { nodes: Category[] } } = await client.request(query);
  return data.categories.nodes;
}


export async function getAllPosts(
  searchTerm: string = '',
  category: string = '',
  params: { before?: string | null; after?: string | null } = {}
): Promise<{
  posts: Post[],
  pageInfo: {
    startCursor: string | null,
    endCursor: string | null,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}> {
  const hasSearchTerm = searchTerm && searchTerm.trim() !== '';
  const hasCategoryTerm = category && category.trim() !== '';
  const isPrevious = !!params.before;

  // Definition
  const variableDefinitions = [
    '$perPage: Int!',
    isPrevious ? '$before: String' : '$after: String',
    hasSearchTerm ? '$search: String' : '',
    hasCategoryTerm ? '$categorySlug: String' : '',
  ].filter(Boolean).join(', ');

  // Where Clause
  const whereConditions = [
    hasSearchTerm ? 'search: $search': '',
    hasCategoryTerm ? 'categoryName: $categorySlug': ''
  ].filter(Boolean);

  const whereClause = whereConditions.length > 0
    ? `where: { ${whereConditions.join(', ')}}`
    : '';

  const query = gql`
    query GetPosts(${variableDefinitions}) {
      posts(
        ${isPrevious ? 'last: $perPage' : 'first: $perPage'},
        ${isPrevious ? 'before: $before' : 'after: $after'},
        ${whereClause}
      ) {
        nodes {
          id
          title
          excerpt
          date
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          seo {
            title
            metaDesc
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
          }
          author {
            node {
              name
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `

  interface Variables {
    perPage: number;
    before?: string | null;
    after?: string | null;
    search?: string;
    categorySlug?: string;
  }

  const variables: Variables = {
    perPage: 10,
    ...(isPrevious
      ? { before: params.before }
      : { after: params.after }
    )
  };

  if (hasSearchTerm) {
    variables.search = searchTerm;
  }

  if (hasCategoryTerm) {
    variables.categorySlug = category;
  }

  const data: {
    posts: {
      nodes: Post[],
      pageInfo: {
        startCursor: string | null,
        endCursor: string | null,
        hasNextPage: boolean,
        hasPreviousPage: boolean
      }
    }
  } = await client.request(query, variables);

  return {
    posts: data.posts.nodes,
    pageInfo: data.posts.pageInfo,
  }

}


export async function getPostsBySlug(slug: string) : Promise<Post | null> {
  const query = gql`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        date
        excerpt
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
          }
        }
      }
    }
  `;

  const variables = { slug };
  const data : { post: Post } = await client.request(query, variables);
  return data.post;
}
