import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Transform database format to component format
      const transformedPosts: BlogPost[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.published_at || post.created_at,
        readTime: post.read_time,
        category: post.category,
        tags: post.tags || [],
        image: post.image_url || "/lovable-uploads/placeholder.png",
        featured: post.featured,
      }));

      setPosts(transformedPosts);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, error, refetch: fetchPosts };
};

export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;

      if (data) {
        const transformedPost: BlogPost = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          date: data.published_at || data.created_at,
          readTime: data.read_time,
          category: data.category,
          tags: data.tags || [],
          image: data.image_url || "/lovable-uploads/placeholder.png",
          featured: data.featured,
        };
        setPost(transformedPost);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching blog post:", err);
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};