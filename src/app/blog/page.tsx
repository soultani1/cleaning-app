import Image from 'next/image';
import Link from 'next/link';
import { fetchAllBlogPosts, BlogPost } from '@/lib/contentful';

export default async function BlogPage() {
  // Fetch all blog posts
  const posts = await fetchAllBlogPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Blog</h1>
        <p className="text-center text-gray-600">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights, tips, and stories from our team
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: BlogPost) => (
          <BlogPostCard key={post.sys.id} post={post} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual blog post card component
 */
function BlogPostCard({ post }: { post: BlogPost }) {
  const { title, slug, coverImage, textLong, date } = post.fields;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Cover Image */}
        {coverImage?.fields?.file?.url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={`https:${coverImage.fields.file.url}`}
              alt={coverImage.fields.title || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <time className="text-sm text-gray-500 mb-2 block">
            {formattedDate}
          </time>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {title}
          </h2>
          
          {textLong && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {textLong}
            </p>
          )}
          
          <div className="mt-4">
            <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}