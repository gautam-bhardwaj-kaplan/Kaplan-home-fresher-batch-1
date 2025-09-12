export function validateParams(requiredKeys, source) {
  for (const key of requiredKeys) {
    if (!(key in source)) { 
      return { valid: false, message: `${key} is required` };
    }
  }
  

  return { valid: true };
}

