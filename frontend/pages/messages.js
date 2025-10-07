import useSWR from 'swr'

const fetcher = async (url) => {
  const token = (typeof window !== 'undefined') ? localStorage.getItem('yamloki_token') : null;
  const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
  const res = await fetch(url, { headers });
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') window.location.href = '/signin';
    return;
  }
  return res.json();
}

export default function Messages(){
  const { data, error } = useSWR((process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000') + '/api/messages', fetcher);
  if (error) return <main style={{padding:40}}>Failed to load</main>
  if (!data) return <main style={{padding:40}}>Loading...</main>
  return (
    <main className="p-10">
      <h1 className="text-2xl font-light">Messages</h1>
      <div className="mt-4 space-y-3">
        {data.map(m=> (
          <div key={m._id} className="p-3 bg-white/5 rounded">
            <div className="flex justify-between">
              <strong>{m.name}</strong>
              <span className="text-sm text-gray-300">{new Date(m.sentAt).toLocaleString()}</span>
            </div>
            <div className="mt-1 text-gray-200">{m.phone}</div>
            <div className="mt-2 text-gray-300">{m.note}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
