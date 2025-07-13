import Link from 'next/link';

export default function ActionButtons() {
  return (
    <div className="flex justify-center gap-4">
      <Link
        href="/create"
        className="px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition"
      >
        Create a Drop
      </Link>
      <Link
        href="/explore"
        className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition"
      >
        Explore Drops
      </Link>
    </div>
  );
}
