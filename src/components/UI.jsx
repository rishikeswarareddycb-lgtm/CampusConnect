import {useEffect} from 'react'
import {X,Inbox} from 'lucide-react'
const tone={Submitted:'bg-slate-100 text-slate-700','In Progress':'bg-amber-100 text-amber-800',Resolved:'bg-teal/15 text-teal-800',Rejected:'bg-red-100 text-red-700',Open:'bg-blue-100 text-blue-700',Claimed:'bg-teal/15 text-teal-800',Lost:'bg-red-100 text-red-700',Found:'bg-teal/15 text-teal-800',High:'bg-red-100 text-red-700',Medium:'bg-amber-100 text-amber-800',Low:'bg-slate-100 text-slate-700'}
export const Badge=({children})=><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tone[children]||'bg-blue-50 text-blue-700'}`}>{children}</span>
export const DemoTag=()=><span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Demo data</span>
export const PageHeader=({title,sub,children})=><div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-semibold text-navy">{title}</h1>{sub&&<p className="mt-1 text-sm text-slate-500">{sub}</p>}</div><div className="flex gap-2">{children}</div></div>
export const Empty=({text='Nothing here yet',action})=><div className="card flex flex-col items-center gap-2 p-10 text-center text-slate-500"><Inbox/><p>{text}</p>{action}</div>
export const Field=({label,error,children})=><label className="block text-sm"><span className="mb-1 block font-medium text-slate-700">{label}</span>{children}{error&&<span role="alert" className="mt-1 block text-xs text-red-600">{error}</span>}</label>
export function Modal({title,onClose,children}){
  useEffect(()=>{const h=e=>e.key==='Escape'&&onClose();window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)},[onClose])
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={title} className="card max-h-[90vh] w-full max-w-lg overflow-auto p-6" onClick={e=>e.stopPropagation()}>
    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-navy">{title}</h2><button aria-label="Close" onClick={onClose} className="rounded p-1 hover:bg-slate-100"><X size={18}/></button></div>{children}</div></div>
}
export const Confirm=({text,onYes,onClose})=><Modal title="Are you sure?" onClose={onClose}><p className="mb-5 text-sm text-slate-600">{text}</p><div className="flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-danger" onClick={()=>{onYes();onClose()}}>Delete</button></div></Modal>
export function ImageUpload({onChange}){
  const pick=e=>{const f=e.target.files[0];if(!f)return onChange(null);if(!f.type.startsWith('image/')||f.size>2e6)return alert('Choose an image under 2 MB');onChange(URL.createObjectURL(f))}
  return <input type="file" accept="image/*" onChange={pick} className="input file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-brand"/>
}
