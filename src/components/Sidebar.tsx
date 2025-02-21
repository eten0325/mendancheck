import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaList, FaCog, FaFileDownload } from 'react-icons/fa';
import {TbLayoutDashboard} from 'react-icons/tb'


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? '64px' : '240px';
  const menuTextVisibility = isCollapsed ? 'hidden' : 'block';

  return (
    <aside
      aria-label="サイドバーメニュー"
      className={`bg-gray-100 min-h-screen h-full  transition-all duration-300 ease-in-out shadow-md flex-shrink-0`}
      style={{ width: sidebarWidth }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin">
            <span className={`text-lg font-semibold ${menuTextVisibility}`}>
              健康診断アプリ
            </span>
          </Link>
          <button
            onClick={toggleCollapse}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="折りたたみ"
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" legacyBehavior>
                <a className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200">
                  <TbLayoutDashboard className="h-5 w-5 text-gray-600" />
                  <span className={`${menuTextVisibility}`}>ダッシュボード</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/logs" legacyBehavior>
                <a className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200">
                  <FaList className="h-5 w-5 text-gray-600" />
                  <span className={`${menuTextVisibility}`}>ログ管理</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" legacyBehavior>
                <a className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200">
                  <FaCog className="h-5 w-5 text-gray-600" />
                  <span className={`${menuTextVisibility}`}>設定管理</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin/download" legacyBehavior>
                <a className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-200">
                  <FaFileDownload className="h-5 w-5 text-gray-600" />
                  <span className={`${menuTextVisibility}`}>ダウンロード</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`p-4 ${menuTextVisibility}`}>
          <p className="text-sm text-gray-500">バージョン 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;