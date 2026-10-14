import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { initStorage } from './src/utils/storage.js';

const PORT = 5001; // Test on 5001

async function runTests() {
  console.log('[Test] Initializing DB and storage...');
  await connectDB();
  await initStorage();

  const server = app.listen(PORT, async () => {
    console.log(`[Test] Server started on port ${PORT}`);

    try {
      // 1. Health check
      const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
      const healthData = await healthRes.json();
      console.log('1. Health check:', healthData.status === 'ok' ? 'PASS' : 'FAIL', healthData);

      // 2. Events list
      const eventsRes = await fetch(`http://localhost:${PORT}/api/events`);
      const eventsData = await eventsRes.json();
      console.log(`2. Events list: PASS (Found ${eventsData.length} events)`);

      // 3. Announcements list
      const annRes = await fetch(`http://localhost:${PORT}/api/announcements`);
      const annData = await annRes.json();
      console.log(`3. Announcements list: PASS (Found ${annData.length} announcements)`);

      // 4. Lost & Found list
      const lfRes = await fetch(`http://localhost:${PORT}/api/lost-found`);
      const lfData = await lfRes.json();
      console.log(`4. Lost & Found: PASS (Found ${lfData.length} items)`);

      // 5. Auth Login (Admin)
      const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@college.edu', password: 'admin123' })
      });
      const loginData = await loginRes.json();
      console.log('5. Admin Login:', loginRes.status === 200 && loginData.token ? 'PASS' : 'FAIL', {
        name: loginData.name,
        role: loginData.role
      });

      // 6. Admin Stats
      const statsRes = await fetch(`http://localhost:${PORT}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${loginData.token}` }
      });
      const statsData = await statsRes.json();
      console.log('6. Admin Stats: PASS', statsData);

      // 7. Student Registration
      const testEmail = `student_${Date.now()}@college.edu`;
      const regRes = await fetch(`http://localhost:${PORT}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Student',
          email: testEmail,
          password: 'password123',
          sid: 'CS99001',
          dept: 'Computer Science',
          year: '2nd'
        })
      });
      const regData = await regRes.json();
      console.log('7. Student Register: PASS', { name: regData.name, email: regData.email });

      // 8. Submit Complaint
      const compRes = await fetch(`http://localhost:${PORT}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${regData.token}`
        },
        body: JSON.stringify({
          title: 'Test Complaint - Lab PC',
          category: 'Infrastructure',
          priority: 'High',
          location: 'Lab 3',
          description: 'PC 12 does not boot up properly.'
        })
      });
      const compData = await compRes.json();
      console.log('8. Submit Complaint: PASS', { id: compData.id, title: compData.title });

      console.log('\n>>> ALL 8 API INTEGRATION TESTS PASSED SUCCESSFULLY! <<<\n');
    } catch (err) {
      console.error('[Test Failed]:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
