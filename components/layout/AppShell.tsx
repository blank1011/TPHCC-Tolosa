'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname?.startsWith('/admin');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? '' : 'pb-24 md:pb-0'}>{children}</div>
    </>
  );
}
