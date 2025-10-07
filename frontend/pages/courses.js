import Link from 'next/link'

const courses = ['HTML','CSS','JavaScript','React','C','Java','Python'];

export default function Courses(){
  return (
    <main className="p-10">
      <h1 className="text-2xl font-light">Courses</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(c => (
          <Link key={c} href={`/courses/${c.toLowerCase()}`} className="block p-4 bg-white/5 rounded-lg hover:scale-[1.02] transition">{c}</Link>
        ))}
      </div>
    </main>
  )
}
