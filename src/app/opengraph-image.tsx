import { ImageResponse } from 'next/og';

export const alt = 'News Era – Latest Tech, Cybersecurity & AI News';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>News Era</div>
        <div style={{ fontSize: 44, marginTop: 24, opacity: 0.95 }}>
          Latest Tech, Cybersecurity & AI News Today
        </div>
        <div style={{ fontSize: 28, marginTop: 40, opacity: 0.8 }}>newsera.blog</div>
      </div>
    ),
    size,
  );
}
