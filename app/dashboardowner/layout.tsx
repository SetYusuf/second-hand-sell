'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import './layout.css';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboardowner' && pathname === '/dashboardowner') {
      return 'active';
    }
    if (path !== '/dashboardowner' && pathname?.startsWith(path)) {
      return 'active';
    }
    return '';
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo-area">
          <div className="sidebar-logo-icon">
            <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="sidebar-title">
            <h1>Owner Panel</h1>
            <p>Welcome back</p>
          </div>
        </div>

        <div className="sidebar-nav-container">
          <div className="nav-section-title">Main Menu</div>
          <nav className="px-2">
            <a href="/dashboardowner" className={`nav-item ${isActive('/dashboardowner')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2 7-7 7 7 2 2v10a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4H9v4a1 1 0 01-1 1H4a1 1 0 01-1-1V12z" />
              </svg>
              <span className="nav-text">Dashboard</span>
            </a>
            <a href="/dashboardowner/notifications" className={`nav-item ${isActive('/dashboardowner/notifications')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.5-1.5a2 2 0 01-.5-1.341V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341A6 6 0 006 11v3.159c0 .506-.201 1-.558 1.358L4 17h5v1a3 3 0 006 0v-1z" />
              </svg>
              <span className="nav-text">Notifications</span>
            </a>
            <a href="/dashboardowner/phone" className={`nav-item ${isActive('/dashboardowner/phone')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm6 10h8" />
              </svg>
              <span className="nav-text">Phone</span>
            </a>
            <a href="/dashboardowner/computer" className={`nav-item ${isActive('/dashboardowner/computer')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16v12H4zM8 17h8v2H8z" />
              </svg>
              <span className="nav-text">Computer</span>
            </a>
            <a href="/dashboardowner/book" className={`nav-item ${isActive('/dashboardowner/book')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14M6 7h8M6 11h8M6 15h6" />
              </svg>
              <span className="nav-text">Book</span>
            </a>
            <a href="/dashboardowner/service" className={`nav-item ${isActive('/dashboardowner/service')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3L5 21h2l1-4h8l1 4h2L14.25 3h-4.5zM9 13l3-8 3 8H9z" />
              </svg>
              <span className="nav-text">Service</span>
            </a>
            <a href="/dashboardowner/product" className={`nav-item ${isActive('/dashboardowner/product')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 10-8 0v4H5a1 1 0 00-1 1v7a2 2 0 002 2h12a2 2 0 002-2v-7a1 1 0 00-1-1h-3zM8 11h8" />
              </svg>
              <span className="nav-text">Product</span>
            </a>
            <a href="/dashboardowner/settings" className={`nav-item ${isActive('/dashboardowner/settings')}`}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.983 4a1 1 0 011.034.777l.317 1.407a7.972 7.972 0 012.033.842l1.25-.851a1 1 0 011.249.153l1.414 1.414a1 1 0 01-.153 1.249l-.851 1.25c.33.65.595 1.342.777 2.033l1.407.317a1 1 0 01.777 1.034v2a1 1 0 01-.777 1.034l-1.407.317a7.972 7.972 0 01-.842 2.033l.851 1.25a1 1 0 01-.153 1.249l-1.414 1.414a1 1 0 01-1.249.153l-1.25-.851a7.972 7.972 0 01-2.033.777l-.317 1.407a1 1 0 01-1.034.777h-2a1 1 0 01-1.034-.777l-.317-1.407a7.972 7.972 0 01-2.033-.842l-1.25.851a1 1 0 01-1.249-.153l-1.414-1.414a1 1 0 01.153-1.249l.851-1.25A7.972 7.972 0 014.8 14.4l-1.407-.317A1 1 0 012.616 13.05v-2a1 1 0 01.777-1.034l1.407-.317a7.972 7.972 0 01.842-2.033l-.851-1.25a1 1 0 01.153-1.249l1.414-1.414a1 1 0 011.249-.153l1.25.851A7.972 7.972 0 019.975 6.2l.317-1.407A1 1 0 0111.326 4h.657z" />
              </svg>
              <span className="nav-text">Settings</span>
            </a>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <svg className="icon-md icon-mr" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <div className="footer-version">v2.1.0<br />© 2026 Owner Panel</div>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-menu-btn">
              <svg className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="search-container">
              <span className="search-icon">
                <svg className="icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input className="search-input" type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="header-right">
            <div className="header-user-area">
              <button className="header-user-btn">
                <img className="user-avatar" src="https://ui-avatars.com/api/?name=Owner+User" alt="Owner Avatar" />
              </button>
            </div>
          </div>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}