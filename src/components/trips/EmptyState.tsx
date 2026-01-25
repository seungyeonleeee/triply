export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-gray-500">
        아직 여행이 없어요
      </p>

      <button className="mt-4 rounded-full bg-black px-6 py-2 text-white">
        여행 추가하기
      </button>
    </div>
  );
}
