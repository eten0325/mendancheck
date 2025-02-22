import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="健康診断結果評価システム"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              健康診断結果評価システム
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;