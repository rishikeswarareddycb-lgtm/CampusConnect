import {Routes,Route,Navigate,Link} from 'react-router-dom'
import {useApp} from './context/AppContext'
import Layout from './components/Layout'
import {Landing,Login,Register} from './pages/Public'
import {Dashboard,Profile} from './pages/Student'
import {Complaints,SubmitComplaint} from './pages/Complaints'
import {LostFound,ReportItem} from './pages/LostFound'
import {Events,Announcements} from './pages/Events'
import Admin from './pages/Admin'
// Frontend-only guard for DEMO roles. Real authorization MUST be enforced by the backend.
const Guard=({role})=>{const {user}=useApp();if(!user)return <Navigate to="/login" replace/>;if(user.role!==role)return <Navigate to={user.role==='admin'?'/admin':'/app'} replace/>;return <Layout/>}
const NotFound=()=><div className="grid min-h-screen place-items-center text-center"><div><h1 className="text-5xl font-bold text-navy">404</h1><p className="my-3 text-slate-500">This page doesn't exist.</p><Link to="/" className="btn-primary">Back to home</Link></div></div>
export default function App(){return <Routes>
  <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/app" element={<Guard role="student"/>}>
    <Route index element={<Dashboard/>}/><Route path="complaints" element={<Complaints/>}/><Route path="complaints/new" element={<SubmitComplaint/>}/>
    <Route path="lost-found" element={<LostFound/>}/><Route path="lost-found/new" element={<ReportItem/>}/>
    <Route path="events" element={<Events/>}/><Route path="announcements" element={<Announcements/>}/><Route path="profile" element={<Profile/>}/></Route>
  <Route path="/admin" element={<Guard role="admin"/>}>
    <Route index element={<Admin section="overview"/>}/>{['complaints','students','events','announcements'].map(s=><Route key={s} path={s} element={<Admin section={s}/>}/>)}</Route>
  <Route path="*" element={<NotFound/>}/></Routes>}
