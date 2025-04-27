
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBlogStore } from '@/lib/db';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useSupabaseAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="py-4 border-b border-gray-200">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-tech-purple">
          Data Shield Partners
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/' ? 'font-medium text-tech-purple' : ''}`}>
            Home
          </Link>
          <Link to="/category/healthcare" className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/healthcare' ? 'font-medium text-tech-purple' : ''}`}>
            Healthcare
          </Link>
          <Link to="/category/finance" className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/finance' ? 'font-medium text-tech-purple' : ''}`}>
            Finance
          </Link>
          <Link to="/category/real-estate" className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/real-estate' ? 'font-medium text-tech-purple' : ''}`}>
            Real Estate
          </Link>
          <Link to="/category/supply-chain" className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/supply-chain' ? 'font-medium text-tech-purple' : ''}`}>
            Supply Chain
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="text-tech-purple hover:text-tech-purple/80 transition-colors">
                Dashboard
              </Link>
              <Button onClick={signOut} variant="ghost">Logout</Button>
            </div>
          ) : (
            <Link to="/admin/login">
              <Button variant="outline">Admin Login</Button>
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
              className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/' ? 'font-medium text-tech-purple' : ''}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/category/healthcare" 
              className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/healthcare' ? 'font-medium text-tech-purple' : ''}`}
              onClick={toggleMenu}
            >
              Healthcare
            </Link>
            <Link 
              to="/category/finance" 
              className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/finance' ? 'font-medium text-tech-purple' : ''}`}
              onClick={toggleMenu}
            >
              Finance
            </Link>
            <Link 
              to="/category/real-estate" 
              className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/real-estate' ? 'font-medium text-tech-purple' : ''}`}
              onClick={toggleMenu}
            >
              Real Estate
            </Link>
            <Link 
              to="/category/supply-chain" 
              className={`text-gray-700 hover:text-tech-purple transition-colors ${location.pathname === '/category/supply-chain' ? 'font-medium text-tech-purple' : ''}`}
              onClick={toggleMenu}
            >
              Supply Chain
            </Link>
            
            {user ? (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/admin/dashboard" 
                  className="text-tech-purple hover:text-tech-purple/80 transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Button onClick={() => { signOut(); toggleMenu(); }} variant="ghost" className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Admin Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
