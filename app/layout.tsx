import "./globals.css";

export const metadata = {
  title: "Nexora AI Enhancer",
  description: "AI photo enhancement and video stabilization."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}