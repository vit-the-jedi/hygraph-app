import "./globals.css";


export const metadata = {
  title: "Docs To Hygraph",
  description: "Send your google doc articles to hygraph CMS",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
