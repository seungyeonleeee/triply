import AuthGuard from "@/components/AuthGuard";

export default function TripsPage() {
  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-xl font-bold">내 여행</h1>
        <p>여행 목록이 여기에 표시됩니다.</p>
      </div>
    </AuthGuard>
  );
}
