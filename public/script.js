const form = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const numberInput = document.getElementById('number');
const message = document.getElementById('message');
const registeredSpan = document.getElementById('registered');
const remainingSpan = document.getElementById('remaining');
const downloadSection = document.getElementById('download');
const fullSection = document.getElementById('full');
const downloadBtn = document.getElementById('downloadBtn');

function updateCounts(users) {
  const registered = users.length;
  const remaining = 1000 - registered;

  registeredSpan.textContent = registered;
  remainingSpan.textContent = remaining;

  if (registered >= 1000) {
    form.style.display = 'none';
    fullSection.style.display = 'block';
    generateVCF(users);
    downloadSection.style.display = 'block';
  }
}

function generateVCF(users) {
  let vcfData = '';
  users.forEach(u => {
    vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:${u.name}💦\nTEL;TYPE=CELL:+${u.number}\nEND:VCARD\n`;
  });
  const blob = new Blob([vcfData], { type: 'text/vcard' });
  downloadBtn.href = URL.createObjectURL(blob);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const number = numberInput.value.trim().replace(/[^0-9]/g, '');

  if (!name || !number) {
    message.textContent = "Please fill in all fields correctly.";
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, number })
    });

    if (res.status === 409) {
      message.textContent = "🚫 Number already registered.";
    } else if (res.status === 403) {
      message.textContent = "🚫 Registration is full.";
    } else if (res.ok) {
      message.textContent = "✅ Registered successfully!";
      nameInput.value = '';
      numberInput.value = '';
      loadUsers();
    }
  } catch (err) {
    message.textContent = "⚠️ Error saving your data.";
  }
});

async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();
    updateCounts(users);
  } catch {
    message.textContent = "⚠️ Failed to load user data.";
  }
}

loadUsers();
