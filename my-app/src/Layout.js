import React from 'react';
import Tgid from './Tgid';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '210px' }}>
        <Tgid />
      </div>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}