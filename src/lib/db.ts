
// This is a simple in-memory database for development
// In a real application, you would connect to a real database

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Category = 'healthcare' | 'finance' | 'real-estate' | 'supply-chain';

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  name: string;
  isAdmin: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: Category;
  author: string;
  publishedDate: string;
  imageUrl: string;
  featured: boolean;
}

interface BlogStore {
  users: User[];
  articles: Article[];
  addUser: (user: User) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticlesByCategory: (category: Category) => Article[];
  getFeaturedArticles: () => Article[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Sample data
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'AI-Powered Diagnostics: The Future of Healthcare',
    slug: 'ai-powered-diagnostics-future-healthcare',
    summary: 'How artificial intelligence is revolutionizing disease diagnosis and patient care',
    content: `
# AI-Powered Diagnostics: The Future of Healthcare

Artificial intelligence is transforming the healthcare industry by enabling faster, more accurate diagnoses and personalized treatment plans. Machine learning algorithms can analyze medical images, patient data, and research papers to identify patterns that might escape human detection.

## Key Applications in Diagnostics

- **Medical Imaging Analysis**: AI systems can detect anomalies in X-rays, MRIs, and CT scans with remarkable precision.
- **Predictive Analytics**: Machine learning models can forecast patient risks and suggest preventive measures.
- **Personalized Medicine**: AI helps tailor treatments to individual patients based on their genetic makeup and medical history.

## Real-World Success Stories

Several hospitals have already implemented AI diagnostic tools with promising results. For example, Stanford's AI system for skin cancer detection achieved accuracy comparable to dermatologists, while being much faster.

## Challenges and Future Directions

Despite its potential, AI in healthcare faces regulatory hurdles, data privacy concerns, and the need for clinical validation. However, as these challenges are addressed, we can expect AI to become an indispensable tool in healthcare, augmenting rather than replacing medical professionals.
    `,
    category: 'healthcare',
    author: 'Dr. Sarah Johnson',
    publishedDate: '2023-09-15',
    imageUrl: '/placeholder.svg',
    featured: true
  },
  {
    id: '2',
    title: 'Blockchain Revolution in Supply Chain Management',
    slug: 'blockchain-revolution-supply-chain-management',
    summary: 'How distributed ledger technology is creating transparent, efficient supply chains',
    content: `
# Blockchain Revolution in Supply Chain Management

Blockchain technology is revolutionizing supply chain management by creating immutable records of transactions across the entire supply network. This transparency helps reduce fraud, improve traceability, and increase efficiency.

## Key Benefits for Supply Chains

- **End-to-End Visibility**: Track products from raw materials to consumers with complete transparency.
- **Smart Contracts**: Automate payments and processes when predefined conditions are met.
- **Reduced Counterfeiting**: Verify product authenticity through tamper-proof records.

## Industry Applications

Major retailers and manufacturers are already implementing blockchain solutions. Walmart, for instance, uses blockchain to track produce from farm to store, reducing the time to trace food origins from days to seconds.

## Implementation Challenges

While promising, blockchain adoption faces challenges including scalability issues, regulatory uncertainty, and the need for industry-wide standards. However, as these hurdles are overcome, blockchain is poised to become a fundamental technology in modern supply chain management.
    `,
    category: 'supply-chain',
    author: 'Marcus Chen',
    publishedDate: '2023-10-02',
    imageUrl: '/placeholder.svg',
    featured: true
  },
  {
    id: '3',
    title: 'The Rise of Algorithmic Trading in Financial Markets',
    slug: 'rise-algorithmic-trading-financial-markets',
    summary: 'Exploring how AI and machine learning are transforming modern trading strategies',
    content: `
# The Rise of Algorithmic Trading in Financial Markets

Algorithmic trading now accounts for over 70% of trading volume in major financial markets, fundamentally changing how assets are bought and sold. Machine learning algorithms can analyze vast amounts of market data to identify trading opportunities within milliseconds.

## Evolution of Trading Algorithms

- **High-Frequency Trading**: Executes thousands of orders per second based on market conditions.
- **Sentiment Analysis**: Algorithms that analyze news and social media to predict market movements.
- **Deep Learning Models**: Neural networks that identify complex patterns in market behavior.

## Impact on Market Dynamics

Algorithmic trading has increased market liquidity and narrowed bid-ask spreads, but has also raised concerns about flash crashes and market manipulation. Regulators worldwide are developing frameworks to ensure algorithmic trading contributes to market stability.

## Future Trends

The next generation of trading algorithms will likely incorporate quantum computing capabilities and more sophisticated AI models, potentially further transforming how financial markets operate.
    `,
    category: 'finance',
    author: 'Jennifer Wong, CFA',
    publishedDate: '2023-09-28',
    imageUrl: '/placeholder.svg',
    featured: false
  },
  {
    id: '4',
    title: 'Smart Cities and Real Estate: Technology Reshaping Urban Living',
    slug: 'smart-cities-real-estate-technology-reshaping-urban-living',
    summary: 'How IoT, AI, and data analytics are creating the intelligent urban environments of tomorrow',
    content: `
# Smart Cities and Real Estate: Technology Reshaping Urban Living

Smart city technologies are transforming real estate by creating more efficient, sustainable, and livable urban environments. From intelligent building systems to citywide IoT networks, technology is reshaping how we interact with our built environment.

## Key Smart City Technologies

- **IoT-Enabled Infrastructure**: Connected sensors monitoring everything from traffic flow to air quality.
- **Smart Buildings**: Automated systems that optimize energy usage, security, and comfort.
- **Digital Twins**: Virtual replicas of physical assets that enable simulation and optimization.

## Impact on Real Estate Markets

Properties in smart city zones often command premium prices due to improved infrastructure, sustainability, and quality of life. Developers increasingly incorporate smart technologies as standard features rather than luxury add-ons.

## Challenges and Opportunities

While smart city implementation faces challenges including privacy concerns and high initial costs, the long-term benefits in resource efficiency and improved urban living make this a critical area for real estate innovation.
    `,
    category: 'real-estate',
    author: 'Robert Park',
    publishedDate: '2023-10-05',
    imageUrl: '/placeholder.svg',
    featured: true
  }
];

const sampleUsers: User[] = [
  {
    id: '1',
    email: 'admin@techhorizon.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    isAdmin: true
  }
];

// Enhance localStorage handling with better error trapping and logging
const localStorageHandler = {
  getItem: (name: string): string | null => {
    try {
      const item = localStorage.getItem(name);
      return item;
    } catch (error) {
      console.error('Error accessing localStorage (getItem):', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
      // Verify data was set correctly
      const storedItem = localStorage.getItem(name);
      if (storedItem !== value) {
        console.warn('LocalStorage verification failed - data mismatch');
      }
    } catch (error) {
      console.error('Error accessing localStorage (setItem):', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error accessing localStorage (removeItem):', error);
    }
  }
};

const createBlogStore = () => {
  // Check if we already have persisted data
  let initialData = {
    users: sampleUsers,
    articles: sampleArticles,
    currentUser: null
  };
  
  try {
    const storedData = localStorage.getItem('blog-storage');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Only use stored data if it has valid structure
      if (parsedData && parsedData.state && 
          Array.isArray(parsedData.state.articles) && 
          Array.isArray(parsedData.state.users)) {
        console.log('Found valid stored data:', parsedData);
        initialData = parsedData.state;
      } else {
        console.warn('Found invalid stored data, using default data');
      }
    } else {
      console.log('No stored data found, using default data');
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
  
  try {
    return create<BlogStore>()(
      persist(
        (set, get) => ({
          users: initialData.users,
          articles: initialData.articles,
          currentUser: initialData.currentUser,
          
          addUser: (user) => set((state) => {
            const updatedState = { users: [...state.users, user] };
            console.log('Adding user:', user, 'New state:', updatedState);
            return updatedState;
          }),
          
          addArticle: (article) => set((state) => {
            const updatedState = { articles: [...state.articles, article] };
            console.log('Adding article:', article, 'New state:', updatedState);
            return updatedState;
          }),
          
          updateArticle: (id, updatedArticle) => set((state) => {
            const updatedState = { 
              articles: state.articles.map((article) => 
                article.id === id ? { ...article, ...updatedArticle } : article
              )
            };
            console.log('Updating article:', id, updatedArticle, 'New state:', updatedState);
            return updatedState;
          }),
          
          deleteArticle: (id) => set((state) => {
            const updatedState = { 
              articles: state.articles.filter((article) => article.id !== id)
            };
            console.log('Deleting article:', id, 'New state:', updatedState);
            return updatedState;
          }),
          
          getArticleBySlug: (slug) => {
            return get().articles.find((article) => article.slug === slug);
          },
          
          getArticlesByCategory: (category) => {
            return get().articles.filter((article) => article.category === category);
          },
          
          getFeaturedArticles: () => {
            return get().articles.filter((article) => article.featured);
          },
          
          login: (email, password) => {
            const user = get().users.find(
              (u) => u.email === email && u.password === password
            );
            
            if (user) {
              set({ currentUser: user });
              return true;
            }
            
            return false;
          },
          
          logout: () => set({ currentUser: null }),
        }),
        {
          name: 'blog-storage',
          storage: createJSONStorage(() => localStorageHandler),
          partialize: (state) => ({
            users: state.users,
            articles: state.articles,
            currentUser: state.currentUser,
          }),
          version: 1,
          onRehydrateStorage: () => (state) => {
            if (state) {
              console.log('Blog store rehydrated successfully');
            } else {
              console.error('Blog store failed to rehydrate');
            }
          },
        }
      )
    );
  } catch (error) {
    console.error('Error creating store:', error);
    // Fallback to non-persisted store if localStorage is unavailable
    return create<BlogStore>()((set, get) => ({
      users: sampleUsers,
      articles: sampleArticles,
      currentUser: null,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
      updateArticle: (id, updatedArticle) => set((state) => ({ 
        articles: state.articles.map((article) => 
          article.id === id ? { ...article, ...updatedArticle } : article
        ) 
      })),
      deleteArticle: (id) => set((state) => ({ 
        articles: state.articles.filter((article) => article.id !== id) 
      })),
      getArticleBySlug: (slug) => get().articles.find((article) => article.slug === slug),
      getArticlesByCategory: (category) => get().articles.filter((article) => article.category === category),
      getFeaturedArticles: () => get().articles.filter((article) => article.featured),
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
    }));
  }
};

export const useBlogStore = createBlogStore();

// Add enhanced console logging to help debug persistence issues
if (typeof window !== 'undefined') {
  try {
    // Log stored data on page load
    const storedData = localStorage.getItem('blog-storage');
    console.log('Initial blog data:', storedData ? JSON.parse(storedData) : '{}');
    
    // Add a manual sync function that can be called after critical operations
    (window as any).syncBlogStore = () => {
      try {
        const currentState = useBlogStore.getState();
        const dataToStore = {
          users: currentState.users,
          articles: currentState.articles,
          currentUser: currentState.currentUser
        };
        
        localStorage.setItem('blog-storage', JSON.stringify({
          state: dataToStore,
          version: 1
        }));
        
        console.log('Manual sync complete:', dataToStore);
        return true;
      } catch (error) {
        console.error('Manual sync failed:', error);
        return false;
      }
    };
    
    // Listen for storage events to help debug
    window.addEventListener('storage', (event) => {
      if (event.key === 'blog-storage') {
        console.log('Storage updated:', event.newValue ? JSON.parse(event.newValue) : '{}');
      }
    });
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
}
