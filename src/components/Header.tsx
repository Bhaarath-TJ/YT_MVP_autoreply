import React, { useState } from 'react';
import { MessageSquareText, Bookmark, LogOut, User, Menu, X, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userEmail = user?.email;

  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <MessageSquareText size={28} className="text-[#FF0000]" />
            <h1 className="text-2xl font-bold text-[#FF0000]">
              CommentQuick
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Platform Links */}
            <div className="flex items-center gap-4">
              <Link
                to="/reply/youtube"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  location.pathname === '/reply/youtube' ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <Youtube size={18} />
                <span>YouTube</span>
              </Link>
            </div>

            {/* Auth Links */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/saved" 
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
                >
                  <Bookmark size={18} />
                  <span>Saved Replies</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
                <div className="flex items-center gap-2">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userEmail || 'User avatar'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col gap-2">
                <Link
                  to="/reply/youtube"
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    location.pathname === '/reply/youtube' ? 'text-red-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Youtube size={18} />
                  <span>YouTube</span>
                </Link>
              {user ? (
                <>
                  <Link 
                    to="/saved" 
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bookmark size={18} />
                    <span>Saved Replies</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;