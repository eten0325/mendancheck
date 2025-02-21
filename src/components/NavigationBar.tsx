import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai';
import { BiLineChart } from 'react-icons/bi';

const NavigationBar: React.FC = () => {
  const router = useRouter();

  const navigationItems = [
    {
      label: 'ホーム',
      href: '/result',
      icon: <AiOutlineHome size={24} />,
    },
    {
      label: 'グラフ',
      href: '/graph',
      icon: <BiLineChart size={24} />,
    },
    {
      label: '設定',
      href: '/ExtractionSettings',
      icon: <AiOutlineSetting size={24} />,
    },
  ];

  return (
    <nav className="bg-white shadow-md py-2">
      <ul className="flex justify-around items-center">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <Link href={item.href}>
              <div
                className={`flex flex-col items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ${router.pathname === item.href ? 'bg-blue-100' : ''}`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;
