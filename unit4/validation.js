export const FIELD_ORDER = [
  "name",
  "age",
  "email",
  "className",
  "phone",
  "password",
  "confirmPassword"
];

export const PASSWORD_CHECK_LABELS = {
  length: "At least 8 characters",
  uppercase: "One uppercase letter",
  lowercase: "One lowercase letter",
  number: "One number",
  special: "One special character"
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

function passwordChecks(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function passwordStrength(password) {
  const checks = passwordChecks(password);
  const passed = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label = "Too weak";
  if (passed === 5) {
    score = 3;
    label = "Strong";
  } else if (passed >= 4) {
    score = 2;
    label = "Good";
  } else if (passed >= 2) {
    score = 1;
    label = "Weak";
  }

  return { score, label, checks };
}

export function validateStudent(form) {
  const errors = { name: [], age: [], email: [], className: [], phone: [], password: [], confirmPassword: [] };

  if (!form.name.trim()) {
    errors.name.push("Student name is required.");
  } else if (form.name.trim().length > 50) {
    errors.name.push("Student name cannot exceed 50 characters.");
  } else if (!/^[a-zA-Z .'-]+$/.test(form.name.trim())) {
    errors.name.push("Use only letters, spaces, dots, apostrophes or hyphens.");
  }

  if (!form.age.trim()) {
    errors.age.push("Age is required.");
  } else if (!/^\d{1,3}$/.test(form.age.trim())) {
    errors.age.push("Age must be a number.");
  } else {
    const age = Number(form.age);
    if (age < 12 || age > 30) {
      errors.age.push("Age must be between 12 and 30.");
    }
  }

  if (!form.email.trim()) {
    errors.email.push("Email is required.");
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email.push("Enter a valid email address.");
  }

  if (!form.className.trim()) {
    errors.className.push("Class / course code is required.");
  } else if (form.className.trim().length > 20) {
    errors.className.push("Class cannot exceed 20 characters.");
  }

  if (!form.phone.trim()) {
    errors.phone.push("Phone number is required.");
  } else if (!PHONE_RE.test(form.phone.trim())) {
    errors.phone.push("Enter a valid 10-digit Indian mobile number.");
  }

  if (!form.password) {
    errors.password.push("Password is required.");
  } else {
    const checks = passwordChecks(form.password);
    if (!checks.length) errors.password.push("Password must be at least 8 characters.");
    if (!checks.uppercase) errors.password.push("Add at least one uppercase letter.");
    if (!checks.lowercase) errors.password.push("Add at least one lowercase letter.");
    if (!checks.number) errors.password.push("Add at least one number.");
    if (!checks.special) errors.password.push("Add at least one special character.");
  }

  if (!form.confirmPassword) {
    errors.confirmPassword.push("Please confirm your password.");
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword.push("Passwords do not match.");
  }

  return errors;
}

export function isFormValid(errors) {
  return FIELD_ORDER.every((field) => errors[field] && errors[field].length === 0);
}