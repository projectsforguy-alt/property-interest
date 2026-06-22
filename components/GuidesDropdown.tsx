'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GUIDES = [
  {
    href: '/off-market-property',
    label: 'Off-market property',
    desc: 'What it is and how to buy it',
  },
  {
    href: '/approach-a-homeowner',
    label: 'Approach a homeowner',
    desc: 'How to make a private approach',
  },
  {
    href: '/sell-without-an-estate-agent',
    label: 'Sell without an agent',
    desc: 'Options, costs, and what to expect',
  },
];

export default function GuidesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = GUIDES.some((g) => g.href === pathname);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div ref={ref} className="guides-dropdown">
      <button
        className={`guides-dropdown-trigger${isActive ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Guides
        <svg
          className={`guides-dropdown-chevron${open ? ' guides-dropdown-chevron--open' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          width="14"
          height="14"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="guides-dropdown-panel" role="menu">
          {GUIDES.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className={`guides-dropdown-item${pathname === href ? ' guides-dropdown-item--active' : ''}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="guides-dropdown-item-label">{label}</span>
              <span className="guides-dropdown-item-desc">{desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
