import './globals.css';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import AppShell from '@/components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'Neel & Ishika Wedding',
  description: 'A celebration of love in Zanzibar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="antialiased min-h-screen bg-brand-cream">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
