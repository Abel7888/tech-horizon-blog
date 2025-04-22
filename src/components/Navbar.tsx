
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBlogStore } from '@/lib/db';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useBlogStore();

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
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              {currentUser.isAdmin && (
                <Link to="/admin/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              )}
              <Button onClick={logout} variant="ghost">Logout</Button>
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
            
            {currentUser ? (
              <div className="flex flex-col space-y-2">
                {currentUser.isAdmin && (
                  <Link to="/admin/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                )}
                <Button onClick={() => { logout(); toggleMenu(); }} variant="ghost" className="w-full">
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
