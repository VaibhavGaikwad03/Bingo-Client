export const validatePassword = (password) => {
  const disallowedCharsRegex = /[^a-zA-Z0-9&$@#_!*%,+}{.=\-']/;
  const disallowedCharMatch = password.match(disallowedCharsRegex);
  if (disallowedCharMatch) {
    return {
      isValid: false,
      error: `The character "${disallowedCharMatch[0]}" is not allowed.`,
    };
  }
  const hasMinLength = password.length >= 8;
  const hasNoSpaces = !/\s/.test(password);
  const hasAllowedSpecialChar = /[&$@#_!*%,+}{.=\-']/.test(password);

  if (!hasMinLength || !hasAllowedSpecialChar || !hasNoSpaces) {
    return {
      isValid: false,
      error:
        "Password must be at least 8 characters, include an allowed special character, and have no spaces.",
    };
  }

  return { isValid: true, value: password };
};

export const validateUsername = (inputValue) => {
  let cleaned = "";
  let error = "";

  for (let i = 0; i < inputValue.length; i++) {
    let char = inputValue[i];
    if (char >= "A" && char <= "Z") {
      char = char.toLowerCase();
    }
    if (/[a-z0-9_]/.test(char)) {
      if (i === 0 && !/[a-z_]/.test(char)) {
        error = "First character must be a lowercase letter or underscore.";
        break;
      }
      cleaned += char;
    } else {
      error = `Character "${inputValue[i]}" is not allowed./`;
    }
  }

  if (!error) {
    const letterCount = (cleaned.match(/[a-z]/g) || []).length;
    if (cleaned.length < 4 || letterCount < 2) {
      error = "Username must have at least 2 letters and 4 total characters.";
    }
    else if (cleaned.length > 25) {
      error = "Username must not exceed 25 characters.";
    }
    
  }

  return {
    newValue: cleaned,
    error,
    isValid: error === "",
    value: cleaned,
  };
};

export const validateName = (input) => {
  if (input === "") {
    return { isValid: false, error: "Name is required.", value: input };
  }
  let cleaned = input.replace(/\s+/g, " ");
  if (cleaned.startsWith(" ")) {
    cleaned = cleaned.trimStart();
  }
  const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
  if (!regex.test(cleaned)) {
    return {
      isValid: false,
      error: "Name must contain only letters and at most one space.",
      value: cleaned,
    };
  }
  return {
    isValid: cleaned.trim().length > 0,
    value: cleaned,
  };
};

export const validateDOB = (date) => {
  if (!date) return { isValid: false, error: "Date of Birth is required." };
  const now = new Date();
  if (new Date(date) >= now) {
    return { isValid: false, error: "DOB must be a past date." };
  }
  return { isValid: true, value: date };
};

export const validatePhone = (input) => {
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.length !== 10) {
    return { isValid: false, error: "Phone number must be exactly 10 digits." };
  }
  return { isValid: true, value: cleaned };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required and must be a string." };
  }
  const trimmedEmail = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(trimmedEmail)) {
    return { isValid: false, error: "Invalid email format." };
  }
  return { isValid: true, value: trimmedEmail };
};

export const validateConfirmPassword = (confirm, password) => {
  if (confirm !== password) {
    return { isValid: false, error: "Passwords do not match." };
  }
  return { isValid: true, value: confirm };
};
