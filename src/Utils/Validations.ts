export const validateEmail = (email: string): boolean => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^\d{10}$/;
  return regex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  return regex.test(password);
};
