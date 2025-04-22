
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ShareButtons from '@/components/ShareButtons';
import { useBlogStore } from '@/lib/db';
import ReactMarkdown from 'react-markdown';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Use useMemo to prevent unnecessary recalculations on each render
  const article = useMemo(() => {
    if (!slug) return null;
    return useBlogStore.getState().getArticleBySlug(slug);
  }, [slug]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!article && slug) {
      navigate('/not-found', { replace: true });
    }
  }, [article, navigate, slug]);
  
  if (!article) {
    return null;
  }
  
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentUrl = window.location.href;
  
  return (
    <Layout
      title={`${article.title} - TechHorizon`}
      description={article.summary}
      keywords={`${article.category}, emerging technology, innovation, ${article.title.toLowerCase()}`}
      ogImage={article.imageUrl}
      ogUrl={currentUrl}
    >
      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-tech-lightPurple text-tech-darkPurple rounded-full">
                  {article.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">{article.summary}</p>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-3">
                    <p className="font-medium">{article.author}</p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                </div>
                
                <ShareButtons title={article.title} url={currentUrl} />
              </div>
            </header>
            
            <div className="mb-8">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
            
            <div className="article-content">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-4">Share this article</h3>
              <ShareButtons title={article.title} url={currentUrl} />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticlePage;
