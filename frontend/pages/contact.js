import { useState } from 'react'

export default function Contact(){
  const [state, setState] = useState({name:'',phone:'',email:'',note:''});
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('Sending...');
    try{
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000') + '/api/messages', {
        method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(state)
      });
      if (!res.ok) throw new Error('Network');
      setMsg('Request sent.');
      setState({name:'',phone:'',email:'',note:''});
    }catch(err){
      setMsg('Failed to send: '+err.message);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-light">Contact / Request Callback</h1>
      <form onSubmit={submit} className="mt-6 max-w-lg">
        <label className="block">Name</label>
        <input value={state.name} onChange={e=>setState({...state,name:e.target.value})} required className="w-full p-2 rounded mt-1 bg-white/5" />
        <label className="block mt-3">Phone</label>
        <input value={state.phone} onChange={e=>setState({...state,phone:e.target.value})} required className="w-full p-2 rounded mt-1 bg-white/5" />
        <label className="block mt-3">Email</label>
        <input value={state.email} onChange={e=>setState({...state,email:e.target.value})} className="w-full p-2 rounded mt-1 bg-white/5" />
        <label className="block mt-3">Note</label>
        <textarea value={state.note} onChange={e=>setState({...state,note:e.target.value})} className="w-full p-2 rounded mt-1 bg-white/5" />
        <div className="mt-4">
          <button className="check-Courses" type="submit">Request Callback</button>
        </div>
        <div className="mt-3">{msg}</div>
      </form>
    </main>
  )
}
