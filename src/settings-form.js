/**
 * settings-form.js
 * Renders a settings form with validation for display name, email,
 * and notification preference. Validates on submit and on blur.
 */

const RULES = {
  displayName: (v) => {
    if (!v) return 'Display name is required.';
    if (v.length < 2 || v.length > 50) return 'Display name must be 2–50 characters.';
    return '';
  },
  email: (v) => {
    if (!v) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
    return '';
  },
};

/** Returns an error message string, or '' if valid. */
function validate(field, value) {
  return RULES[field] ? RULES[field](value) : '';
}

/** Shows or clears the inline error for a field. */
function setError(form, field, message) {
  const el = form.querySelector(`[data-error="${field}"]`);
  if (el) el.textContent = message;
}

/** Reads current field errors and toggles the submit button. */
function syncSubmitButton(form) {
  const hasErrors = [...form.querySelectorAll('[data-error]')].some(
    (el) => el.textContent.trim() !== ''
  );
  form.querySelector('[type="submit"]').disabled = hasErrors;
}

/** Builds and returns the settings <form> element. */
function createSettingsForm(onSubmit) {
  const form = document.createElement('form');
  form.id = 'settings-form';
  form.noValidate = true;
  form.innerHTML = `
    <div class="field">
      <label for="displayName">Display Name</label>
      <input id="displayName" name="displayName" type="text" required />
      <span class="error" data-error="displayName"></span>
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
      <span class="error" data-error="email"></span>
    </div>
    <div class="field field--checkbox">
      <label>
        <input id="notifications" name="notifications" type="checkbox" />
        Enable notifications
      </label>
    </div>
    <button type="submit">Save Settings</button>
  `;

  // Validate on blur for text/email inputs
  form.querySelectorAll('input[type="text"], input[type="email"]').forEach((input) => {
    input.addEventListener('blur', () => {
      const msg = validate(input.name, input.value.trim());
      setError(form, input.name, msg);
      syncSubmitButton(form);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields on submit
    let isValid = true;
    ['displayName', 'email'].forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      const msg = validate(field, input.value.trim());
      setError(form, field, msg);
      if (msg) isValid = false;
    });

    syncSubmitButton(form);

    if (isValid && typeof onSubmit === 'function') {
      onSubmit({
        displayName: form.querySelector('[name="displayName"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        notifications: form.querySelector('[name="notifications"]').checked,
      });
    }
  });

  return form;
}

/** Mounts the settings form into a container element. */
function mountSettingsForm(container, onSubmit) {
  container.appendChild(createSettingsForm(onSubmit));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validate, createSettingsForm, mountSettingsForm };
}
