import { z } from 'zod';

// Define validation schema for checkout form
export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Името трябва да бъде поне 2 символа" })
    .max(50, { message: "Името не може да надвишава 50 символа" }),
  
  lastName: z
    .string()
    .min(2, { message: "Фамилията трябва да бъде поне 2 символа" })
    .max(50, { message: "Фамилията не може да надвишава 50 символа" }),
  
  email: z
    .string()
    .email({ message: "Моля, въведете валиден имейл адрес" }),
  
  phone: z
    .string()
    .min(7, { message: "Телефонният номер е твърде кратък" })
    .max(15, { message: "Телефонният номер е твърде дълъг" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Моля, въведете валиден телефонен номер" }),
  
  address: z
    .string()
    .min(5, { message: "Адресът трябва да бъде поне 5 символа" })
    .max(100, { message: "Адресът не може да надвишава 100 символа" }),
  
  city: z
    .string()
    .min(2, { message: "Градът трябва да бъде поне 2 символа" })
    .max(50, { message: "Градът не може да надвишава 50 символа" }),
  
  state: z
    .string()
    .max(50, { message: "Областта не може да надвишава 50 символа" })
    .optional(),
  
  postcode: z
    .string()
    .max(20, { message: "Пощенският код не може да надвишава 20 символа" })
    .optional(),
  
  country: z
    .string()
    .min(2, { message: "Държавата трябва да бъде поне 2 символа" }),
  
  notes: z
    .string()
    .max(500, { message: "Бележките не могат да надвишават 500 символа" })
    .optional()
});