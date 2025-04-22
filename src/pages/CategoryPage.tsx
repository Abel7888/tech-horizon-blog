
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useBlogStore, Category } from '@/lib/db';

const categoryTitles: Record<Category, string> = {
  'healthcare': 'Healthcare Technology',
  'finance': 'Financial Technology',
  'real-estate': 'Real Estate Innovation',
  'supply-chain': 'Supply Chain Solutions'
};

const categoryDescriptions: Record<Category, string> = {
  'healthcare': 'Discover how emerging technologies are revolutionizing healthcare delivery, diagnosis, and patient care.',
  'finance': 'Explore the latest innovations transforming financial services, investments, and monetary systems.',
  'real-estate': 'Learn about cutting-edge technologies reshaping how we design, build, and interact with physical spaces.',
  'supply-chain': 'Understand how new technologies are creating more efficient, transparent, and resilient supply networks.'
};

const CategoryPage = () => {
  const { category } = useParams<{ category: Category }>();
  const articles = useBlogStore((state) => 
    state.getArticlesByCategory(category as Category)
  );
  
  const title = categoryTitles[category as Category] || 'Articles';
  const description = categoryDescriptions[category as Category] || '';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);
  
  return (
    <Layout 
      title={`${title} - TechHorizon`}
      description={description}
      keywords={`${category} technology, emerging tech, innovation, digital transformation`}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-12">{description}</p>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No articles found</h3>
              <p className="text-gray-500 mt-2">
                Check back soon for updates in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
