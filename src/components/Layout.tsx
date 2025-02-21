import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen h-full bg-gray-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-800">健康診断結果評価システム</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-200 py-4 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">© 2025 健康診断結果評価システム</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
