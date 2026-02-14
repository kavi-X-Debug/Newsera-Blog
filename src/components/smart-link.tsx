'use client';

import React from 'react';

type SmartLinkProps = {
  href: string;
  adHref: string;
  className?: string;
  rel?: string;
  children: React.ReactNode;
};

export default function SmartLink({
  href,
  adHref,
  className,
  rel,
  children,
}: SmartLinkProps) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const keyBase = `${adHref}::${href}`;
    const key = 'ad_click_' + encodeURIComponent(keyBase);
    const countStr = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : '0';
    const count = Number(countStr || '0');
    if (typeof window !== 'undefined') {
      e.preventDefault();
      if (count === 0) {
        try {
          window.sessionStorage.setItem(key, '1');
        } catch {}
        window.open(adHref, '_blank', 'noopener,noreferrer');
      } else {
        try {
          window.sessionStorage.setItem(key, '0');
        } catch {}
        window.location.href = href;
      }
    }
  };

  return (
    <a
      href={href}
      rel={rel}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
