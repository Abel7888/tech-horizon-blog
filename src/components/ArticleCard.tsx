
import { Link } from 'react-router-dom';
import { Article } from '@/lib/db';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const CategoryBadge = ({ category }: { category: Article['category'] }) => {
  const colors = {
    'healthcare': 'bg-blue-100 text-blue-800',
    'finance': 'bg-green-100 text-green-800',
    'real-estate': 'bg-purple-100 text-purple-800',
    'supply-chain': 'bg-orange-100 text-orange-800'
  };
  
  const displayNames = {
    'healthcare': 'Healthcare',
    'finance': 'Finance',
    'real-estate': 'Real Estate',
    'supply-chain': 'Supply Chain'
  };
  
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded', colors[category])}>
      {displayNames[category]}
    </span>
  );
};

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (featured) {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Link to={`/article/${article.slug}`}>
          <div className="h-96 bg-gray-200 relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="mb-2">
                <CategoryBadge category={article.category} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h2>
              <p className="mb-3 text-gray-200 line-clamp-2">{article.summary}</p>
              <div className="flex items-center text-sm">
                <span>{article.author}</span>
                <span className="mx-2">•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/article/${article.slug}`}>
        <div className="h-48 bg-gray-200">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <div className="mb-2">
            <CategoryBadge category={article.category} />
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
