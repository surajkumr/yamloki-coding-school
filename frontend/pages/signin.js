import { useState } from 'react'

export default function Signin(){
  const [email,setEmail] = useState('');
  const [pw,setPw] = useState('');
  const [msg,setMsg] = useState('');
  const [mode,setMode] = useState('login'); // or 'register'

  async function submit(e){
    e.preventDefault();
    setMsg(mode === 'login' ? 'Signing in...' : 'Registering...');
    try{
      const url = (process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000') + (mode === 'login' ? '/api/auth/login' : '/api/auth/register');
      const res = await fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ email, password: pw }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Auth failed');
      localStorage.setItem('yamloki_token', j.token);
      localStorage.setItem('yamloki_email', j.email);
      setMsg(mode === 'login' ? 'Signed in' : 'Registered and signed in');
      window.location.href = '/messages';
    }catch(err){ setMsg('Error: '+err.message); }
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-light">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h1>
      <div className="mt-3 mb-4">
        <button onClick={()=>setMode('login')} className="check-Courses mr-2">Sign In</button>
        <button onClick={()=>setMode('register')} className="check-Courses">Sign Up</button>
      </div>
      <form onSubmit={submit} className="max-w-md">
        <label className="block">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required className="w-full p-2 rounded mt-1 bg-white/5" />
        <label className="block mt-3">Password</label>
        <input value={pw} onChange={e=>setPw(e.target.value)} type="password" required className="w-full p-2 rounded mt-1 bg-white/5" />
        <div className="mt-4"><button className="check-Courses">{mode === 'login' ? 'Sign In' : 'Create Account'}</button></div>
        <div className="mt-2">{msg}</div>
      </form>
    </main>
  )
}
