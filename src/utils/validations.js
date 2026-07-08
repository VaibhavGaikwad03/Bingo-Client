export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: "Password is required." };
  const disallowedCharsRegex = /[^a-zA-Z0-9&$@#_!*%,+}{.=\-']/;
  const disallowedCharMatch = password.match(disallowedCharsRegex);
  if (disallowedCharMatch) {
    return { isValid: false, error: `Character "${disallowedCharMatch[0]}" is not allowed.` };
  }
  const hasMinLength = password.length >= 8;
  const hasNoSpaces = !/\s/.test(password);
  const hasAllowedSpecialChar = /[&$@#_!*%,+}{.=\-']/.test(password);
  if (!hasMinLength || !hasAllowedSpecialChar || !hasNoSpaces) {
    return { isValid: false, error: "Min 8 chars, include a special character, no spaces." };
  }
  return { isValid: true, error: "", value: password };
};

export const validateUsername = (inputValue) => {
  if (!inputValue) return { newValue: "", error: "", isValid: false, value: "" };
  let cleaned = "";
  let error = "";
  for (let i = 0; i < inputValue.length; i++) {
    let char = inputValue[i];
    if (char >= "A" && char <= "Z") char = char.toLowerCase();
    if (/[a-z0-9_]/.test(char)) {
      if (i === 0 && !/[a-z_]/.test(char)) {
        error = "First character must be a letter or underscore.";
        break;
      }
      cleaned += char;
    } else {
      error = `Character "${inputValue[i]}" is not allowed.`;
    }
  }
  if (!error) {
    const letterCount = (cleaned.match(/[a-z]/g) || []).length;
    if (cleaned.length < 4 || letterCount < 2) {
      error = "Min 2 letters and 4 total characters.";
    } else if (cleaned.length > 25) {
      error = "Max 25 characters.";
    }
  }
  return { newValue: cleaned, error, isValid: error === "", value: cleaned };
};

export const validateDOB = (date) => {
  if (!date) return { isValid: false, error: "Date of birth is required." };
  if (new Date(date) >= new Date()) return { isValid: false, error: "Must be a past date." };
  return { isValid: true, error: "", value: date };
};

export const validatePhone = (input) => {
  if (!input) return { isValid: false, error: "Phone number is required." };
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 10) return { isValid: false, error: "Must be exactly 10 digits." };
  return { isValid: true, error: "", value: cleaned };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return { isValid: false, error: "Email is required." };
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { isValid: false, error: "Invalid email format." };
  }
  return { isValid: true, error: "", value: trimmed };
};
