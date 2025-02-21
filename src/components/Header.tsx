import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        // Fetch username from 'users' table
        const { data: user, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching username:', error);
        } else if (user) {
          setUsername(user.username);
        }
      }
    };

    checkSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        const fetchUsername = async () => {
          const { data: user, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching username:', error);
          } else if (user) {
            setUsername(user.username);
          }
        };
        fetchUsername();
      } else {
        setUsername('');
      }
    });
  }, [supabase]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300 
                      min-h-20 h-full w-full px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" legacyBehavior>
            <img
              src="https://placehold.co/50x50"
              alt="ロゴ"
              className="h-10 w-10 mr-4"
            />
        </Link>
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold text-gray-800 hover:text-blue-500 transition-colors duration-200">健康診断結果</a>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" legacyBehavior>
            <a className="text-gray-600 hover:text-blue-500 transition-colors duration-200">ホーム</a>
        </Link>

        {
          isLoggedIn ? (
            <>
              <Link href="/result" legacyBehavior>
                <a className="text-gray-600 hover:text-blue-500 transition-colors duration-200">結果</a>
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                ログアウト ({username})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" legacyBehavior>
                <a className="text-gray-600 hover:text-blue-500 transition-colors duration-200">ログイン</a>
              </Link>
              <Link href="/register" legacyBehavior>
                <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">登録</a>
              </Link>
            </>
          )
        }
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-500 focus:outline-none">
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full right-0 bg-white shadow-md rounded-md mt-2 py-2 w-48">
          <Link href="/" legacyBehavior>
            <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200">ホーム</a>
          </Link>
          {
            isLoggedIn ? (
              <>
                <Link href="/result" legacyBehavior>
                  <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200">結果</a>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-left text-gray-600 hover:bg-gray-100 transition-colors duration-200 w-full"
                >
                  ログアウト ({username})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" legacyBehavior>
                  <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200">ログイン</a>
                </Link>
                <Link href="/register" legacyBehavior>
                  <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200">登録</a>
                </Link>
              </>
            )
          }
        </div>
      )}
    </header>
  );
};

export default Header;