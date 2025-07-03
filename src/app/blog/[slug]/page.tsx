import Image from 'next/image';
import { notFound } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { fetchBlogPostBySlug, fetchAllBlogPosts } from '@/lib/contentful';

// Generate static params for all blog posts (optional, for static generation)
export async function generateStaticParams() {
  const posts = await fetchAllBlogPosts();
  
  return posts.map((post) => ({
    slug: post.fields.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.fields.title,
    description: post.fields.textLong,
    openGraph: {
      title: post.fields.title,
      description: post.fields.textLong,
      ...(post.fields.coverImage?.fields?.file?.url && {
        images: [
          {
            url: `https:${post.fields.coverImage.fields.file.url}`,
            width: 1200,
            height: 630,
            alt: post.fields.title,
          },
        ],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params (required in Next.js 15)
  const { slug } = await params;
  
  // Fetch the blog post
  const post = await fetchBlogPostBySlug(slug);

  // If post not found, return 404
  if (!post) {
    notFound();
  }

  const { title, coverImage, date, content, author } = post.fields;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Rich text rendering options
  const richTextOptions = {
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
      [MARKS.CODE]: (text: any) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-6 leading-relaxed text-gray-700">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="ml-4">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: any) => (
        <blockquote className="border-l-4 border-blue-500 pl-6 py-2 mb-6 italic text-gray-600 bg-blue-50">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-gray-300" />,
      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <time className="text-sm">{formattedDate}</time>
        </div>

        {/* Author Info */}
        {author?.fields && (
          <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-lg">
            {author.fields.picture?.fields?.file?.url && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={`https:${author.fields.picture.fields.file.url}`}
                  alt={author.fields.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">Written by {author.fields.name}</p>
            </div>
          </div>
        )}
      </header>

      {/* Cover Image */}
      {coverImage?.fields?.file?.url && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={`https:${coverImage.fields.file.url}`}
            alt={coverImage.fields.title || title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {documentToReactComponents(content, richTextOptions)}
      </div>

      {/* Back to Blog Link */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <a
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to all posts
        </a>
      </div>
    </article>
  );
}