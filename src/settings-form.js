const form = document.getElementById('settings-form');

const rules = {
  username: (v) => v.trim() ? '' : 'Username is required.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email.',
  password: (v) => v.length >= 8 ? '' : 'Password must be at least 8 characters.',
};

function validate() {
  let valid = true;
  for (const [field, rule] of Object.entries(rules)) {
    const input = document.getElementById(field);
    const error = document.getElementById(`${field}-error`);
    const msg = rule(input.value);
    error.textContent = msg;
    input.classList.toggle('invalid', !!msg);
    if (msg) valid = false;
  }
  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validate()) alert('Settings saved!');
});
