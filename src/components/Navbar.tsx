import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBlogStore } from '@/lib/db';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useSupabaseAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="py-4 border-b border-gray-200">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-tech-purple">
          TechHorizon
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-tech-purple transition-colors">
            Home
          </Link>
          <Link to="/category/healthcare" className="text-gray-700 hover:text-tech-purple transition-colors">
            Healthcare
          </Link>
          <Link to="/category/finance" className="text-gray-700 hover:text-tech-purple transition-colors">
            Finance
          </Link>
          <Link to="/category/real-estate" className="text-gray-700 hover:text-tech-purple transition-colors">
            Real Estate
          </Link>
          <Link to="/category/supply-chain" className="text-gray-700 hover:text-tech-purple transition-colors">
            Supply Chain
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">
                {profile?.full_name || profile?.email || "User"}
              </span>
              <Button onClick={signOut} variant="ghost">Logout</Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline">Login / Sign Up</Button>
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container px-4 py-4 mx-auto bg-white animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-tech-purple transition-colors" 
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/category/healthcare" 
              className="text-gray-700 hover:text-tech-purple transition-colors"
              onClick={toggleMenu}
            >
              Healthcare
            </Link>
            <Link 
              to="/category/finance" 
              className="text-gray-700 hover:text-tech-purple transition-colors"
              onClick={toggleMenu}
            >
              Finance
            </Link>
            <Link 
              to="/category/real-estate" 
              className="text-gray-700 hover:text-tech-purple transition-colors"
              onClick={toggleMenu}
            >
              Real Estate
            </Link>
            <Link 
              to="/category/supply-chain" 
              className="text-gray-700 hover:text-tech-purple transition-colors"
              onClick={toggleMenu}
            >
              Supply Chain
            </Link>
            
            {user ? (
              <div className="flex flex-col space-y-2">
                <span className="px-4">{profile?.full_name || profile?.email || "User"}</span>
                <Button onClick={() => { signOut(); toggleMenu(); }} variant="ghost" className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Login / Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
