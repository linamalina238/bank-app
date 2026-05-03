export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[\d\+\-\s]{10,15}$/;
  return re.test(phone);
};

export function validateRegistrationData(name, email, password, phone) {
  if (!name || name.trim().length < 2) {
    return { success: false, message: "Ім'я занадто коротке" };
  }
  if (!validateEmail(email)) {
    return { success: false, message: "Невірний формат пошти" };
  }
  if (!validatePassword(password)) {
    return { success: false, message: "Пароль має бути не менше 6 символів" };
  }
  if (!validatePhone(phone)) {
    return { success: false, message: "Невірний формат телефону" };
  }
  return { success: true };
}

export function validateLoginData(email, password) {
  if (!validateEmail(email)) {
    return { success: false, message: "Введіть коректну пошту" };
  }
  if (!password) {
    return { success: false, message: "Введіть пароль" };
  }
  return { success: true };
}