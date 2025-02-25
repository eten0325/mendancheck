import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUser, FaLock } from 'react-icons/fa';
import Link from 'next/link';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: userId,
        password: password,
      });

      if (signInError) {
        console.error('ログインエラー:', signInError);
        setError(signInError.message);
      } else if (data?.user) {
        console.log('ログイン成功:', data);
        // ログイン成功時の処理
        await router.push('/mainmenu');
      }
    } catch (err: any) {
      console.error('エラー:', err);
      setError(err.message || 'ログイン中にエラーが発生しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>
        {error && <div className="bg-red-200 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
              <FaUser className="inline-block mr-1" />
              ユーザーID:
            </label>
            <input
              type="email"
              id="userId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="メールアドレスを入力してください"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              <FaLock className="inline-block mr-1" />
              パスワード:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="パスワードを入力してください"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              ログイン
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link 
            href="/auth/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            アカウントを作成
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
