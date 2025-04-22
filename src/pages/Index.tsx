
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useBlogStore, Category } from '@/lib/db';
import { Button } from '@/components/ui/button';

const CategorySection = ({ title, category }: { title: string; category: Category }) => {
  const articles = useBlogStore((state) => state.getArticlesByCategory(category));
  
  if (articles.length === 0) return null;
  
  return (
    <section className="my-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link to={`/category/${category}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const featuredArticles = useBlogStore((state) => state.getFeaturedArticles());
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Emerging Technology Insights
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Discover how cutting-edge technologies are transforming industries and shaping our future.
          </p>
          
          {featuredArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="md:col-span-2">
                <ArticleCard article={featuredArticles[0]} featured={true} />
              </div>
              
              {featuredArticles.slice(1, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <CategorySection title="Healthcare Technology" category="healthcare" />
      <CategorySection title="Financial Technology" category="finance" />
      <CategorySection title="Real Estate Innovation" category="real-estate" />
      <CategorySection title="Supply Chain Solutions" category="supply-chain" />
    </Layout>
  );
};

export default Index;
