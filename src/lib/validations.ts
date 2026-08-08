import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico o ReyID es obligatorio' })
    .refine(
      (val) => z.string().email().safeParse(val).success || val.startsWith('did:rey:') || val.startsWith('@'),
      { message: 'Ingrese un correo válido, un handle (@usuario) o un DID válido (did:rey:...)' }
    ),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
      .max(60, { message: 'El nombre completo es demasiado largo' }),
    email: z
      .string()
      .min(1, { message: 'El correo electrónico es obligatorio' })
      .email({ message: 'Proporcione una dirección de correo electrónico válida' }),
    handle: z
      .string()
      .min(3, { message: 'El alias debe tener al menos 3 caracteres' })
      .regex(/^[a-zA-Z0-9_@]+$/, { message: 'El alias solo puede contener letras, números y guiones bajos' }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .regex(/[A-Za-z]/, { message: 'Debe contener al menos una letra' })
      .regex(/[0-9]/, { message: 'Debe contener al menos un número' }),
    confirmPassword: z.string().min(1, { message: 'Confirme su contraseña' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const web3SignatureSchema = z.object({
  messageToSign: z
    .string()
    .min(5, { message: 'El mensaje de firma debe tener al menos 5 caracteres' }),
  network: z.enum(['REYCHAIN_L2', 'ETH_MAINNET', 'POLYGON'], {
    message: 'Seleccione una red válida',
  }),
});

export type Web3SignatureFormData = z.infer<typeof web3SignatureSchema>;
