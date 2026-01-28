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
  author: {
    node: {
      name: string
    }
  }
  categories: {
    nodes: {
      name: Array<string>
    }
  }
  tags: {
    nodes: {
      name: string
    }
  }
}