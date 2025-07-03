import { createClient } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// Types for our Contentful data
interface Author {
  fields: {
    name: string;
    picture?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
}

interface BlogPostFields {
  title: string;
  slug: string;
  coverImage?: {
    fields: {
      file: {
        url: string;
      };
      title: string;
    };
  };
  date: string;
  textLong: string; // Changed from excerpt to textLong
  content: Document;
  author?: Author;
}

export interface BlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: BlogPostFields;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

/**
 * Fetch all published blog posts, ordered by date (newest first)
 */
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost', // This should match your Content Type ID
      order: '-fields.date', // Order by date, newest first
      include: 2, // Include linked entries (author)
    });

    return entries.items as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by its slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const entries = await client.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      include: 2, // Include linked entries (author)
      limit: 1,
    });

    if (entries.items.length > 0) {
      return entries.items[0] as BlogPost;
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}