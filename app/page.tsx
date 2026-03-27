import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Karim's Pizza</h1>
      <Link href="/pizza" className="bg-orange-500 text-white px-6 py-3 rounded-lg">
        Order Now
      </Link>
    </div>
  );
}
