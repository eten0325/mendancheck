import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">会社情報</h3>
            <ul className="mt-2">
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">会社概要</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">沿革</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">事業内容</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">サービス</h3>
            <ul className="mt-2">
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">健康診断結果分析</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">リスク評価</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">データ管理</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">サポート</h3>
            <ul className="mt-2">
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">よくある質問</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">お問い合わせ</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">利用規約</a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900">プライバシーポリシー</a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">ソーシャル</h3>
            <ul className="mt-2 flex space-x-4">
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900" aria-label="GitHub"><FaGithub size={24} /></a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900" aria-label="Twitter"><FaTwitter size={24} /></a>
                </Link>
              </li>
              <li>
                <Link href="#" legacyBehavior>
                  <a className="text-gray-500 hover:text-gray-900" aria-label="LinkedIn"><FaLinkedin size={24} /></a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Health Check System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
