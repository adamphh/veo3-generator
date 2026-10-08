import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shopee Veo 3 Video Generator - Tự Động Hóa Video Affiliate 9:16',
  description: 'Tạo hàng loạt 10 Video Shopee Affiliate từ Link/Upload với Google Veo 3, Gemini 2.0 và TTS tiếng Việt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
