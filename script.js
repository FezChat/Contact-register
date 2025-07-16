const form = document.getElementById('registerForm');
const numberInput = document.getElementById('number');
const nameInput = document.getElementById('name');
const message = document.getElementById('message');
const registeredSpan = document.getElementById('registered');
const remainingSpan = document.getElementById('remaining');
const downloadSection = document.getElementById('download');
const fullSection = document.getElementById('full');
const downloadBtn = document.getElementById('downloadBtn');

let users = JSON.parse(localStorage.getItem('luckyUsers')) || [];

function updateCounts() {
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
    vcfData += `BEGIN:VCARD\nVERSION:3.0\nFN:${u.name} LuckyMd💨\nTEL;TYPE=CELL:+${u.number}\nEND:VCARD\n`;
  });

  const blob = new Blob([vcfData], { type: 'text/vcard' });
  downloadBtn.href = URL.createObjectURL(blob);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const number = numberInput.value.trim().replace(/[^0-9]/g, '');

  if (!name || !number) {
    message.textContent = "Please fill all fields correctly.";
    return;
  }

  const exists = users.find(u => u.number === number);
  if (exists) {
    message.textContent = "🚫 Number already registered.";
    return;
  }

  if (users.length >= 1000) {
    message.textContent = "Registration is already full!";
    return;
  }

  users.push({ name, number });
  localStorage.setItem('luckyUsers', JSON.stringify(users));

  message.textContent = "✅ Successfully registered!";
  nameInput.value = '';
  numberInput.value = '';
  updateCounts();
});

updateCounts();
