const adminUser = 'Fredi Ai';
const adminPass = 'Arusha2025#';

// Login handler
function loginAdmin() {
  const userInput = document.getElementById('adminUser').value;
  const passInput = document.getElementById('adminPass').value;
  const message = document.getElementById('adminMessage');

  if (userInput === adminUser && passInput === adminPass) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminData();
  } else {
    message.textContent = '❌ Wrong username or password.';
  }
}

// Load users from backend
async function loadAdminData() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();

    const list = document.getElementById('numberList');
    const adminRegistered = document.getElementById('adminRegistered');
    const adminRemaining = document.getElementById('adminRemaining');
    const downloadBtn = document.getElementById('adminDownloadBtn');

    adminRegistered.textContent = users.length;
    adminRemaining.textContent = 1000 - users.length;

    list.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.name} LuckyMd💨 - ${u.number}`;
      list.appendChild(li);
    });

    // Generate VCF
    let vcfData = '';
    users.forEach(u => {
      vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:LuckyMd💨 ${u.name}\nTEL;TYPE=CELL:+${u.number}\nEND:VCARD\n`;
    });

    const blob = new Blob([vcfData], { type: 'text/vcard' });
    downloadBtn.href = URL.createObjectURL(blob);

  } catch (err) {
    alert("⚠️ Failed to load users: " + err.message);
  }
}
