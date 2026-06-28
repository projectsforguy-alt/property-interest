'use client';

import dynamic from 'next/dynamic';

const MobileNavInner = dynamic(() => import('./MobileNavInner'), { ssr: false });

export default function MobileNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return <MobileNavInner isLoggedIn={isLoggedIn} />;
}
