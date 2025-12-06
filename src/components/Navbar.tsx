/**
 * Navbar Component
 * Modern, elegant navigation bar
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectUser, logoutUser } from '@/redux/slices/auth.slice';
import { selectCartItemCount } from '@/redux/slices/cart.slice';
import { selectWishlistItemCount } from '@/redux/slices/wishlist.slice';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const wishlistItemCount = useAppSelector(selectWishlistItemCount);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold text-neutral-900">UTEShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-foreground/70 hover:text-foreground transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-foreground/70 hover:text-foreground transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-foreground/70 hover:text-foreground">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-accent-foreground">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-accent"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-accent"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/reviews"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-accent"
                  >
                    Đánh giá
                  </Link>
                  <Link
                    to="/vouchers"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-accent"
                  >
                    Vouchers
                  </Link>
                  <Link
                    to="/loyalty-points"
                    className="block px-4 py-3 text-sm text-foreground hover:bg-accent"
                  >
                    Điểm tích lũy
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-destructive hover:bg-accent"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary font-medium">
                Home
              </Link>
              <Link to="/products" className="text-foreground hover:text-primary font-medium">
                Products
              </Link>
              <Link
                to="/wishlist"
                className="text-foreground hover:text-primary font-medium flex items-center justify-between"
              >
                <span>Wishlist</span>
                {wishlistItemCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="text-foreground hover:text-primary font-medium flex items-center justify-between"
              >
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-foreground hover:text-primary font-medium">
                    Profile
                  </Link>
                  <Link to="/orders" className="text-foreground hover:text-primary font-medium">
                    Orders
                  </Link>
                  <Link to="/reviews" className="text-foreground hover:text-primary font-medium">
                    Đánh giá
                  </Link>
                  <Link to="/vouchers" className="text-foreground hover:text-primary font-medium">
                    Vouchers
                  </Link>
                  <Link
                    to="/loyalty-points"
                    className="text-foreground hover:text-primary font-medium"
                  >
                    Điểm tích lũy
                  </Link>
                  <button onClick={handleLogout} className="text-left text-destructive font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-foreground hover:text-primary font-medium">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
