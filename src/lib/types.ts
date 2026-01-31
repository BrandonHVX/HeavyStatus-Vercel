export type Category = {
  id: string;
  name: string;
  slug: string;
}

export type Post = {
  id: number;
  title: string;
  slug: string;
  date: string;
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
      name: string
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
