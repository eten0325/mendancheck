import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, ChartBarIcon, CogIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const navigationItems = [
  {
    label: 'ホーム',
    href: '/',
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    label: 'アップロード',
    href: '/fileUpload',
    icon: <DocumentTextIcon className="h-6 w-6" />,
  },
  {
    label: '結果',
    href: '/scoringresult',
    icon: <ChartBarIcon className="h-6 w-6" />,
  },
  {
    label: '設定',
    href: '/settings',
    icon: <CogIcon className="h-6 w-6" />,
  },
];

const NavigationBar: React.FC = () => {
  const router = useRouter() as any;
  const pathname = router?.pathname;

  const currentPath = React.useMemo(() => {
    if (typeof window === 'undefined') return '/';
    return pathname || '/';
  }, [pathname]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-600 hover:text-gray-900">
              <div
                className={`flex flex-col items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
                  currentPath === item.href ? 'bg-blue-100' : ''
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
