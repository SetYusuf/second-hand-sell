/**
 * Input validation utilities
 */

/**
 * Validates an email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates product form data
 */
export function validateProductForm(data: any): { valid: boolean; error?: string } {
  if (!data.title || data.title.trim() === '') {
    return { valid: false, error: 'Title is required' };
  }
  
  if (!data.type || data.type.trim() === '') {
    return { valid: false, error: 'Product type is required' };
  }
  
  if (!data.brand || data.brand.trim() === '') {
    return { valid: false, error: 'Brand is required' };
  }
  
  if (!data.condition || data.condition.trim() === '') {
    return { valid: false, error: 'Condition is required' };
  }
  
  if (!data.price || isNaN(data.price) || Number(data.price) < 0) {
    return { valid: false, error: 'Valid price is required' };
  }
  
  if (!data.location || data.location.trim() === '') {
    return { valid: false, error: 'Location is required' };
  }
  
  if (!data.contactName || data.contactName.trim() === '') {
    return { valid: false, error: 'Seller name is required' };
  }
  
  if (!data.contactEmail || !validateEmail(data.contactEmail)) {
    return { valid: false, error: 'Valid email is required' };
  }
  
  if (!data.contactPhone || data.contactPhone.trim() === '') {
    return { valid: false, error: 'Phone number is required' };
  }
  
  return { valid: true };
}

/**
 * Validates login form data
 */
export function validateLoginForm(data: any): { valid: boolean; error?: string } {
  if (!data.email || !validateEmail(data.email)) {
    return { valid: false, error: 'Valid email is required' };
  }
  
  if (!data.password || data.password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { valid: true };
}

/**
 * Validates register form data
 */
export function validateRegisterForm(data: any): { valid: boolean; error?: string } {
  if (!data.name || data.name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  if (!data.email || !validateEmail(data.email)) {
    return { valid: false, error: 'Valid email is required' };
  }
  
  if (!data.password || data.password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  
  if (data.password !== data.confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  
  return { valid: true };
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 */
export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

/**
 * Validates that a required field is not empty
 */
export function validateRequired(value: any, fieldName: string): { valid: boolean; error?: string } {
  if (value === undefined || value === null) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  return { valid: true };
}