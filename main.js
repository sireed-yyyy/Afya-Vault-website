// main.js - Afya-Vault simplified demo
const demo = { patients: {}, records: {}, appts: {} };

function el(id){ return document.getElementById(id); }
function setMsg(msg){ const m = el('msg'); if(m) m.innerText = msg; }

// Login page
if (el('loginBtn')) {
  el('demoBtn').addEventListener('click', ()=>{
    localStorage.setItem('afya_demo_user', JSON.stringify({ email: 'demo@afya.test', role: document.getElementById('role').value }));
    window.location.href = 'dashboard.html';
  });

  el('loginBtn').addEventListener('click', async ()=> {
    const email = el('email').value.trim(), password = el('password').value;
    if(!email||!password) return setMsg('Enter email & password');
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        localStorage.setItem('afya_firebase_user', JSON.stringify({ email, role: document.getElementById('role').value }));
        window.location.href = 'dashboard.html';
      } catch(e) { setMsg('Login failed: '+e.message); }
    } else {
      setMsg('Firebase not configured — use Demo Login');
    }
  });
}

// Dashboard
if (el('createPatientBtn')) {
  const user = JSON.parse(localStorage.getItem('afya_firebase_user') || localStorage.getItem('afya_demo_user') || '{}');
  el('userTitle').innerText = user.email ? (user.role || 'User') : 'Guest Demo';
  el('userEmail').innerText = user.email || '';

  el('logoutBtn').addEventListener('click', ()=>{ localStorage.removeItem('afya_demo_user'); localStorage.removeItem('afya_firebase_user'); window.location.href='index.html'; });

  async function createDemoPatient(){
    const id = 'P-'+Math.random().toString(36).slice(2,9);
    demo.patients[id] = { id, name: 'Demo Patient', phone: '+254700000000' };
    demo.records[id] = [];
    el('patientId').value = id;
    alert('Demo patient created: '+id);
  }

  el('createPatientBtn').addEventListener('click', createDemoPatient);

  el('addApptBtn').addEventListener('click', ()=>{
    const pid = el('patientId').value.trim();
    if(!pid) return alert('Enter patient id');
    const date = el('apptDate').value || new Date().toISOString().slice(0,10);
    demo.appts[pid] = demo.appts[pid] || [];
    demo.appts[pid].push({ id: 'A-'+Date.now(), date });
    renderAppts(pid);
  });

  el('loadRecordsBtn').addEventListener('click', ()=>{
    const pid = el('patientId').value.trim();
    if(!pid) return alert('Enter patient id');
    renderRecords(pid);
    renderAppts(pid);
  });

  el('addRecordBtn').addEventListener('click', ()=>{
    const pid = el('patientId').value.trim();
    if(!pid) return alert('Enter patient id');
    const note = el('newNote').value.trim();
    if(!note) return alert('Enter a note');
    const rec = { id: 'R-'+Date.now(), type: 'visit', data: { notes: note }, createdAt: new Date().toISOString(), signed: false, signature: null };
    demo.records[pid] = demo.records[pid] || [];
    demo.records[pid].unshift(rec);
    el('newNote').value = '';
    renderRecords(pid);
  });

  function renderRecords(pid){
    const list = el('recordsList'); list.innerHTML = '';
    const records = demo.records[pid] || [];
    if(records.length===0) list.innerHTML = '<li class="list-group-item small text-muted">No records</li>';
    records.forEach(r=>{
      const li = document.createElement('li'); li.className = 'list-group-item';
      li.innerHTML = `<div><strong>${r.type}</strong> — <small>${new Date(r.createdAt).toLocaleString()}</small></div>
                      <div>${r.data.notes}</div>
                      <div class="mt-1"><small>Signed: ${r.signed ? 'Yes' : 'No'}</small></div>`;
      if(!r.signed){
        const signBtn = document.createElement('button'); signBtn.className='btn btn-sm btn-outline-success mt-2'; signBtn.innerText='Sign (Provider)';
        signBtn.addEventListener('click', ()=>{
          r.signed = true; r.signature = { signedBy: user.email || 'demo-provider', signedAt: new Date().toISOString() };
          renderRecords(pid);
          alert('Record signed (demo). In production this should use cryptographic keys.');
        });
        li.appendChild(signBtn);
      } else {
        const vbtn = document.createElement('button'); vbtn.className='btn btn-sm btn-outline-primary mt-2'; vbtn.innerText='View Signature';
        vbtn.addEventListener('click', ()=> alert('Signed by: '+r.signature.signedBy+'\nAt: '+r.signature.signedAt));
        li.appendChild(vbtn);
      }
      list.appendChild(li);
    });
  }

  function renderAppts(pid){
    const list = el('apptList'); list.innerHTML='';
    const ap = demo.appts[pid] || [];
    if(ap.length===0) list.innerHTML = '<li class="small text-muted">No appointments</li>';
    ap.forEach(a=>{
      const li = document.createElement('li'); li.innerText = a.date;
      list.appendChild(li);
    });
  }

  el('emergencyBtn').addEventListener('click', ()=>{
    const modal = new bootstrap.Modal(document.getElementById('emModal'));
    modal.show();
  });
}
