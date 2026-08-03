/**
 * tests/settings-form.test.js
 * Tests for settings-form.js: validation rules, submit behaviour,
 * inline error messages, and submit-button disabled state.
 */

const { validate, createSettingsForm } = require('../src/settings-form');

// ---------------------------------------------------------------------------
// Unit tests for the pure validate() helper
// ---------------------------------------------------------------------------
describe('validate()', () => {
  describe('displayName', () => {
    test('empty value returns required error', () => {
      expect(validate('displayName', '')).toBe('Display name is required.');
    });

    test('1-char value returns length error', () => {
      expect(validate('displayName', 'A')).toBe('Display name must be 2–50 characters.');
    });

    test('51-char value returns length error', () => {
      expect(validate('displayName', 'A'.repeat(51))).toBe(
        'Display name must be 2–50 characters.'
      );
    });

    test('2-char value is valid', () => {
      expect(validate('displayName', 'Jo')).toBe('');
    });

    test('50-char value is valid', () => {
      expect(validate('displayName', 'A'.repeat(50))).toBe('');
    });
  });

  describe('email', () => {
    test('empty value returns required error', () => {
      expect(validate('email', '')).toBe('Email is required.');
    });

    test('value without @ returns format error', () => {
      expect(validate('email', 'notanemail')).toBe('Enter a valid email address.');
    });

    test('value without domain returns format error', () => {
      expect(validate('email', 'user@')).toBe('Enter a valid email address.');
    });

    test('valid email returns empty string', () => {
      expect(validate('email', 'user@example.com')).toBe('');
    });
  });

  test('unknown field returns empty string', () => {
    expect(validate('notifications', 'anything')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Integration tests using the DOM form
// ---------------------------------------------------------------------------
function buildForm(onSubmit) {
  const form = createSettingsForm(onSubmit);
  document.body.appendChild(form);
  return form;
}

function fillForm(form, { displayName = '', email = '', notifications = false } = {}) {
  form.querySelector('[name="displayName"]').value = displayName;
  form.querySelector('[name="email"]').value = email;
  form.querySelector('[name="notifications"]').checked = notifications;
}

function submitForm(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function blurField(form, name) {
  form.querySelector(`[name="${name}"]`).dispatchEvent(new Event('blur'));
}

function errorText(form, field) {
  return form.querySelector(`[data-error="${field}"]`).textContent;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createSettingsForm() — submit validation', () => {
  test('valid submission calls onSubmit with correct data', () => {
    const onSubmit = jest.fn();
    const form = buildForm(onSubmit);
    fillForm(form, { displayName: 'Alice', email: 'alice@example.com', notifications: true });
    submitForm(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      displayName: 'Alice',
      email: 'alice@example.com',
      notifications: true,
    });
  });

  test('invalid submission does not call onSubmit', () => {
    const onSubmit = jest.fn();
    const form = buildForm(onSubmit);
    submitForm(form); // all fields empty
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows displayName error on submit when empty', () => {
    const form = buildForm();
    submitForm(form);
    expect(errorText(form, 'displayName')).toBe('Display name is required.');
  });

  test('shows displayName length error on submit when too short', () => {
    const form = buildForm();
    fillForm(form, { displayName: 'A', email: 'a@b.com' });
    submitForm(form);
    expect(errorText(form, 'displayName')).toBe('Display name must be 2–50 characters.');
  });

  test('shows email error on submit when empty', () => {
    const form = buildForm();
    fillForm(form, { displayName: 'Alice' });
    submitForm(form);
    expect(errorText(form, 'email')).toBe('Email is required.');
  });

  test('shows email format error on submit when invalid', () => {
    const form = buildForm();
    fillForm(form, { displayName: 'Alice', email: 'bad-email' });
    submitForm(form);
    expect(errorText(form, 'email')).toBe('Enter a valid email address.');
  });
});

describe('createSettingsForm() — blur validation', () => {
  test('shows displayName error on blur when empty', () => {
    const form = buildForm();
    blurField(form, 'displayName');
    expect(errorText(form, 'displayName')).toBe('Display name is required.');
  });

  test('shows email error on blur when invalid', () => {
    const form = buildForm();
    form.querySelector('[name="email"]').value = 'oops';
    blurField(form, 'email');
    expect(errorText(form, 'email')).toBe('Enter a valid email address.');
  });

  test('clears error on blur when field becomes valid', () => {
    const form = buildForm();
    // First blur with bad value to set error
    form.querySelector('[name="email"]').value = 'bad';
    blurField(form, 'email');
    expect(errorText(form, 'email')).not.toBe('');

    // Fix the value and blur again
    form.querySelector('[name="email"]').value = 'good@example.com';
    blurField(form, 'email');
    expect(errorText(form, 'email')).toBe('');
  });
});

describe('createSettingsForm() — submit button disabled state', () => {
  test('submit button is enabled initially (no errors shown yet)', () => {
    const form = buildForm();
    expect(form.querySelector('[type="submit"]').disabled).toBe(false);
  });

  test('submit button is disabled after failed submit', () => {
    const form = buildForm();
    submitForm(form); // triggers errors
    expect(form.querySelector('[type="submit"]').disabled).toBe(true);
  });

  test('submit button re-enables once all errors are cleared', () => {
    const form = buildForm();
    submitForm(form); // set errors

    // Fix both fields via blur
    form.querySelector('[name="displayName"]').value = 'Alice';
    blurField(form, 'displayName');
    form.querySelector('[name="email"]').value = 'alice@example.com';
    blurField(form, 'email');

    expect(form.querySelector('[type="submit"]').disabled).toBe(false);
  });
});
