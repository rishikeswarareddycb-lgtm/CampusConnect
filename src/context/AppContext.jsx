import {createContext,useContext,useState,useEffect,useCallback} from 'react'
import {CheckCircle2,XCircle} from 'lucide-react'
import * as D from '../data/mockData'
const Ctx=createContext()
export const useApp=()=>useContext(Ctx)
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}
const seed=()=>({complaints:D.complaints,items:D.items,events:D.events,announcements:D.announcements,students:D.students,registered:[2],read:[]})
export function AppProvider({children}){
  // Demo-only persistence: no passwords or tokens are ever stored.
  const [user,setUser]=useState(()=>load('cc_user',null))
  const [db,setDb]=useState(()=>load('cc_db',seed()))
  const [toasts,setToasts]=useState([])
  useEffect(()=>localStorage.setItem('cc_user',JSON.stringify(user)),[user])
  useEffect(()=>localStorage.setItem('cc_db',JSON.stringify(db)),[db])
  const toast=useCallback((msg,type='success')=>{const id=Math.random();setToasts(t=>[...t,{id,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500)},[])
  const patch=(k,fn)=>setDb(d=>({...d,[k]:fn(d[k])}))
  const reset=()=>{setDb(seed());toast('Demo data reset')}
  return <Ctx.Provider value={{user,setUser,db,patch,toast,reset}}>{children}
    <div className="fixed bottom-4 right-4 z-[100] space-y-2" aria-live="polite">{toasts.map(t=>
      <div key={t.id} className="card flex items-center gap-2 px-4 py-3 text-sm">{t.type==='error'?<XCircle className="text-red-600" size={18}/>:<CheckCircle2 className="text-teal" size={18}/>}{t.msg}</div>)}</div>
  </Ctx.Provider>
}
