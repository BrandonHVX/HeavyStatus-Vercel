"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FeaturedPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  timeAgo: string;
  imageUrl: string;
  duration: string;
  href: string;
}

interface UpNextPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  timeAgo: string;
  imageUrl: string;
  duration: string;
  href: string;
}

interface LiveClientWrapperProps {
  featuredPost: FeaturedPost;
  upNextPosts: UpNextPost[];
}

export default function LiveClientWrapper({
  featuredPost,
  upNextPosts,
}: LiveClientWrapperProps) {
  const router = useRouter();
  const [autoplay, setAutoplay] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div>
        <Image
          src={featuredPost.imageUrl}
          alt={featuredPost.title}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>

      <div>
        <span>{featuredPost.category}</span>
        <h1 dangerouslySetInnerHTML={{ __html: featuredPost.title }} />
        <p>{featuredPost.author} · {featuredPost.timeAgo}</p>
        <p>Duration: {featuredPost.duration}</p>
        <Link href={featuredPost.href}>Read article</Link>
      </div>

      <div>
        <h2>Description</h2>
        <p>
          {descExpanded
            ? featuredPost.excerpt
            : featuredPost.excerpt.slice(0, 140)}
          {featuredPost.excerpt.length > 140 && !descExpanded && (
            <>
              ....
              <button onClick={() => setDescExpanded(true)}>
                read more
              </button>
            </>
          )}
        </p>
      </div>

      <hr />

      <div>
        <h2>Up Next</h2>
        <label>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
          Autoplay
        </label>

        <ul>
          {upNextPosts.map((post) => (
            <li key={post.id}>
              <Link href={post.href}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={100}
                  height={75}
                  sizes="100px"
                />
                <span dangerouslySetInnerHTML={{ __html: post.title }} />
              </Link>
              <p>{post.category} · {post.timeAgo} · {post.duration}</p>
              <button
                onClick={() => toggleSave(post.id)}
                aria-label={savedPosts.has(post.id) ? "Remove bookmark" : "Save for later"}
              >
                {savedPosts.has(post.id) ? "★ Saved" : "☆ Save"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
