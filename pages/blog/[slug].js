import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import Breadcrumb from '../Breadcrumb';
import Comments from '../../components/Comments';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';

const BlogPost = ({ initialBlog }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [schemaData, setSchemaData] = useState(null);
  const [breadcrumbSchema, setBreadcrumbSchema] = useState(null);

  useEffect(() => {
    if (!initialBlog && slug) {
      const fetchBlogData = async () => {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
          const { data } = await axios.get(apiUrl);
          const blogs = data;

          const foundBlog = blogs.find(blog => blog.slug === slug);
          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            setBlog(null);
          }
        } catch (error) {
          console.error('Error fetching blog:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBlogData();
    }
  }, [slug, initialBlog]);

  useEffect(() => {
    if (blog) {
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "image": [blog.image || "https://example.com/photos/1x1/photo.jpg"],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "author": {
          "@type": "Person",
          "name": blog.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "ytubetools",
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.jpg"
          }
        },
        "description": blog.description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`
        }
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.ytubetools.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": blog.title,
            "item": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`
          }
        ]
      };

      setSchemaData(schemaData);
      setBreadcrumbSchema(breadcrumbSchema);
    }
  }, [blog, slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!blog) {
    return <p className="text-red-500 text-center">Blog not found.</p>;
  }

  const shareUrl = `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`;
  const title = blog.title;

  return (
    <div className="relative">
      <Head>
        <title>{blog.title} | ytubetools</title>
        <meta name="description" content={blog.description} />
        <meta name="keywords" content={`SEO, Blog, ytubetools, ${blog.title}`} />
        <meta name="author" content={blog.author} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.image || "https://example.com/photos/1x1/photo.jpg"} />
        <meta property="og:url" content={`https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.image || "https://example.com/photos/1x1/photo.jpg"} />
        <meta name="twitter:site" content="@ytubetools" />

        {schemaData && <script type="application/ld+json">{JSON.stringify(schemaData)}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <Breadcrumb blogTitle={blog.title} />
        <div className="bg-white shadow-sm sm:rounded-lg mb-8">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

            {blog.image && (
              <Image
                src={blog.image}
                alt={blog.title}
                width={600}
                height={400}
                layout="responsive"
                className="object-cover rounded-lg"
              />
            )}

            <div className="my-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

            <div className="my-8">
              <h3 className="text-lg font-bold mb-4">Share this post</h3>
              <div className="flex space-x-4">
                <FacebookShareButton url={shareUrl} quote={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={title}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>
          </div>
        </div>
        <Comments slug={slug} />
      </div>
    </div>
  );
};

export async function getServerSideProps({ params, req }) {
  try {
    const { slug } = params;
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/blogs`;

    const { data } = await axios.get(apiUrl);
    const blog = data.find(blog => blog.slug === slug);

    if (!blog) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialBlog: blog,
      },
    };
  } catch (error) {
    console.error('Error fetching blog:', error.message);
    return {
      notFound: true,
    };
  }
}

export default BlogPost;
