export default function AppFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full md:min-w-xl bg-white shadow-md">
      {children}
    </div>
  );
}
