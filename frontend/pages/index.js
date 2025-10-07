import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-light">Yamloki Coding Room (Next.js)</h1>
      <p className="mt-4 text-lg text-gray-200">This is a minimal Next.js frontend scaffold. Replace with the real UI or integrate existing static files.</p>
      <div className="mt-6 space-y-2">
        <Link className="block text-teal-300 hover:underline" href="/courses">Courses</Link>
        <Link className="block text-teal-300 hover:underline" href="/contact">Contact</Link>
        <Link className="block text-teal-300 hover:underline" href="/signin">Sign In</Link>
        <Link className="block text-teal-300 hover:underline" href="/messages">Messages</Link>
      </div>
    </main>
  )
}
