'use client';

import React from 'react';

type SmartLinkProps = {
  href: string;
  adHref: string;
  className?: string;
  rel?: string;
  children: React.ReactNode;
  newTab?: boolean;
};

export default function SmartLink({
  href,
  adHref,
  className,
  rel,
  children,
  newTab = true,
}: SmartLinkProps) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const key = 'ad_seen_once';
    const seen = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : '1';
    const targetUrl = seen ? href : adHref;
    if (typeof window !== 'undefined') {
      e.preventDefault();
      try {
        window.sessionStorage.setItem(key, '1');
      } catch {}
      if (newTab) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={rel}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
