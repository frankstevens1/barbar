export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}
