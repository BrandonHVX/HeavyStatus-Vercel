export type Category = {
  id: string;
  name: string;
  slug: string;
}

export type Author = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  avatar: {
    url: string;
  } | null;
}

export type Post = {
  id: number;
  title: string;
  slug: string;
  date: string;
  modified: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    }
  };
  seo?: {
    title?: string;
    metaDesc?: string;
    opengraphTitle?: string;
    opengraphDescription?: string;
    opengraphImage?: {
      sourceUrl?: string;
    };
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: {
      sourceUrl?: string;
    };
  };
  author: {
    node: {
      name: string;
      slug: string;
    }
  }
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[]
  }
  tags: {
    nodes: {
      name: string;
    }[]
  }
}
