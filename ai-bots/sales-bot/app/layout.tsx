export const metadata = {
  title: 'Kingdom Sales Bot',
  description: 'Sales assistant chatbot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b1220] text-white antialiased">{children}</body>
    </html>
  );
}


