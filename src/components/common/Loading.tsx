"use client";

export default function Loading({
  label = "불러오는 중...",
}: {
  label?: string;
}) {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
