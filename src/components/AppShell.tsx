'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoginGate from './LoginGate';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LoginGate>
      <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className="transition-all duration-200 pt-[var(--navbar-height)] min-h-screen"
        style={{ marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </LoginGate>
  );
}
