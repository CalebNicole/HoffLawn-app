export const metadata = {
  title: 'HoffLawn Ops',
  description: 'HoffLawn Operations Hub',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
