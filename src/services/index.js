// LIVE-API-READY methods. The UI currently uses DEMO state from AppContext,
// so none of these are called yet. Swap them in page by page once the Express backend exists.
import api from './api'
export const authService={register:d=>api.post('/auth/register',d),login:d=>api.post('/auth/login',d),profile:()=>api.get('/students/me'),updateProfile:d=>api.put('/students/me',d)}
export const complaintService={list:p=>api.get('/complaints',{params:p}),create:d=>api.post('/complaints',d),updateStatus:(id,status)=>api.patch(`/complaints/${id}/status`,{status})}
export const lostFoundService={list:p=>api.get('/lost-found',{params:p}),report:d=>api.post('/lost-found',d)}
export const eventService={list:()=>api.get('/events'),register:id=>api.post(`/events/${id}/register`),cancel:id=>api.delete(`/events/${id}/register`),create:d=>api.post('/events',d),update:(id,d)=>api.put(`/events/${id}`,d),remove:id=>api.delete(`/events/${id}`)}
export const announcementService={list:()=>api.get('/announcements'),create:d=>api.post('/announcements',d),update:(id,d)=>api.put(`/announcements/${id}`,d),remove:id=>api.delete(`/announcements/${id}`)}
export const adminService={students:()=>api.get('/admin/students'),stats:()=>api.get('/admin/stats')}
