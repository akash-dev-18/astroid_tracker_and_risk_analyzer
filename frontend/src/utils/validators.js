export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  
  let strength = 0;
  

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (password.length >= 16) strength += 1;
  

  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  if (strength <= 2) {
    return { strength: 1, label: 'Weak', color: 'bg-danger-500' };
  } else if (strength <= 4) {
    return { strength: 2, label: 'Medium', color: 'bg-warning-500' };
  } else {
    return { strength: 3, label: 'Strong', color: 'bg-success-500' };
  }
};

export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = fields[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !value) {
      errors[field] = `${fieldRules.label || field} is required`;
    } else if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email';
    } else if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
    } else if (fieldRules.match && value !== fields[fieldRules.match]) {
      errors[field] = `${fieldRules.label || field} must match ${fieldRules.matchLabel || fieldRules.match}`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
