
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useBlogStore, Article, Category } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const ArticleForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  const articles = useBlogStore((state) => state.articles);
  const addArticle = useBlogStore((state) => state.addArticle);
  const updateArticle = useBlogStore((state) => state.updateArticle);
  
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'healthcare',
    author: '',
    publishedDate: new Date().toISOString().split('T')[0],
    imageUrl: '/placeholder.svg',
    featured: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Protect the route
    if (!user) {
      navigate('/admin/login');
      return;
    }
    
    // If editing, load article data
    if (isEditing && id) {
      const article = articles.find((a) => a.id === id);
      if (article) {
        setFormData({
          ...article,
          publishedDate: new Date(article.publishedDate).toISOString().split('T')[0]
        });
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [user, navigate, isEditing, id, articles]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && id) {
        updateArticle(id, formData as Partial<Article>);
        toast({
          title: "Success!",
          description: "Article updated successfully.",
        });
        console.log("Updated article:", id, formData);
      } else {
        // Create new article
        const newArticle = {
          ...formData,
          id: Date.now().toString(),
        } as Article;
        
        addArticle(newArticle);
        toast({
          title: "Success!",
          description: "New article created successfully.",
        });
        console.log("Created new article:", newArticle);
      }
      
      // Force manual sync to ensure data is persisted
      try {
        if (typeof window !== 'undefined' && (window as any).syncBlogStore) {
          (window as any).syncBlogStore();
        }
      } catch (syncError) {
        console.error("Error syncing data:", syncError);
      }
      
      // Wait a moment before redirecting to ensure state is updated
      setTimeout(() => {
        navigate('/admin/dashboard');
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <Layout title={`${isEditing ? 'Edit' : 'New'} Article - Data Shield Partners`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  URL-friendly version of the title (auto-generated, but you can edit it)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, 'category')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="supply-chain">Supply Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="publishedDate">Published Date</Label>
                  <Input
                    id="publishedDate"
                    name="publishedDate"
                    type="date"
                    value={formData.publishedDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="/placeholder.svg"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={Boolean(formData.featured)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(checked as boolean, 'featured')
                  }
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this article on homepage
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  Use Markdown syntax for formatting (# for headings, ** for bold, etc.)
                </p>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleForm;
