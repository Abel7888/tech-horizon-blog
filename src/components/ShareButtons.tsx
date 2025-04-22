
import { Twitter, Linkedin, Facebook, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The article link has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
      >
        <Button variant="outline" size="icon">
          <Twitter size={18} />
        </Button>
      </a>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <Button variant="outline" size="icon">
          <Facebook size={18} />
        </Button>
      </a>
      
      <a 
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Button variant="outline" size="icon">
          <Linkedin size={18} />
        </Button>
      </a>
      
      <Button variant="outline" size="icon" onClick={handleCopyLink}>
        <Link size={18} />
      </Button>
    </div>
  );
};

export default ShareButtons;
