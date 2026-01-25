export default function AppFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white shadow-md">
      {children}
    </div>
  );
}
