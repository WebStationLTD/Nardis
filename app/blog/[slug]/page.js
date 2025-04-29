import { getPostBySlug } from "@/services/postService";
import { cache } from "react";
import StructuredData from "@/components/StructuredData";
import { generateArticleSchema } from "@/utils/structuredData";
import Image from "next/image";

// Cached data fetching function to ensure it only runs once
const getPost = cache(async (slug) => {
  const post = await getPostBySlug(slug);

  if (!post || post.length === 0) {
    throw new Error("Post not found");
  }

  return post[0];
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const meta = post?.yoast_head_json || {};
  const ogImage =
    meta?.og_image && meta.og_image.length > 0
      ? meta.og_image[0].url
      : "/placeholder.webp";

  return {
    title: meta.title || post.title.rendered,
    description: meta.description || "",
    openGraph: {
      title: meta.og_title || post.title.rendered,
      description: meta.og_description || "",
      images: [{ url: ogImage }],
    },
    alternates: {
      canonical: meta.canonical || "",
    },
  };
}

export default async function PostPage({ params }) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    const meta = post?.yoast_head_json || {};
    const ogImage =
      meta?.og_image && meta.og_image.length > 0
        ? meta.og_image[0].url
        : "/placeholder.webp";

    return (
      <>
        <StructuredData data={generateArticleSchema(post)} />
        <div className="bg-white">
          <div className="mx-auto max-w-10/10 py-0 sm:px-6 sm:py-0 lg:px-0">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-23 text-center shadow-2xl sm:px-23">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {post.title.rendered}
                </h1>
              </div>
              <svg
                viewBox="0 0 1024 1024"
                aria-hidden="true"
                className="absolute -top-50 left-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              >
                <circle
                  r={512}
                  cx={512}
                  cy={512}
                  fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                  fillOpacity="0.9"
                />
                <defs>
                  <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                    <stop stopColor="#129160" />
                    <stop offset={1} stopColor="#129160" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <article className="mx-auto max-w-8xl w-full">
              {ogImage && (
                <Image
                  src={ogImage}
                  alt={meta.og_title || post.title.rendered}
                  width={1200}
                  height={630}
                  className="w-full h-auto mb-8 rounded-xl shadow-lg"
                  priority
                />
              )}
              <time
                dateTime={new Date(post.date).toISOString()}
                className="block mt-2 text-sm text-gray-500"
              >
                {new Date(post.date).toLocaleDateString()}
              </time>
              <div
                className="wordpress-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </article>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return <p>Error: {error.message}</p>;
  }
}
