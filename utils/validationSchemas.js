import * as Yup from "yup";

// Common password validation schema
export const passwordValidation = Yup.string()
  .min(8, "Паролата трябва да бъде поне 8 символа")
  .matches(/[a-z]/, "Паролата трябва да съдържа поне една малка буква")
  .matches(/[A-Z]/, "Паролата трябва да съдържа поне една главна буква")
  .matches(/[0-9]/, "Паролата трябва да съдържа поне една цифра")
  .required("Паролата е задължителна");

// Common email validation schema
export const emailValidation = Yup.string()
  .email("Невалиден имейл адрес")
  .required("Имейлът е задължителен");

// Login form validation schema
export const LoginSchema = Yup.object().shape({
  email: emailValidation,
  password: Yup.string().required("Паролата е задължителна"),
  remember: Yup.boolean(),
});

// Register form validation schema
export const RegisterSchema = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Паролите не съвпадат")
    .required("Потвърждението на паролата е задължително"),
});

// Forgot password form validation schema
export const ForgotPasswordSchema = Yup.object().shape({
  email: emailValidation,
});

// Reset password form validation schema
export const ResetPasswordSchema = Yup.object().shape({
  email: emailValidation,
  code: Yup.string().required("Кодът е задължителен"),
  newPassword: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Паролите не съвпадат")
    .required("Потвърждението на паролата е задължително"),
}); 