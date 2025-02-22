import React, { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* 必要ならヘッダーやフッターなどの共通UIを配置 */}
      {children}
    </div>
  );
} 