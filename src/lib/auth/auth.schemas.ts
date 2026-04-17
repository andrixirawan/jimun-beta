import { z } from 'zod';

export const signInInputSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters.'),
});

export const signUpInputSchema = signInInputSchema.extend({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.'),
});

const authIdSchema = z.union([z.number(), z.string()]);
const nullableStringSchema = z.string().nullable().optional();

export const authUserSchema = z.object({
  id: authIdSchema,
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: nullableStringSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  firstName: nullableStringSchema,
  lastName: nullableStringSchema,
  phoneNumber: nullableStringSchema,
  role: nullableStringSchema,
  banned: z.boolean().nullable().optional(),
  banReason: nullableStringSchema,
  banExpires: nullableStringSchema,
});

export const authSessionSchema = z.object({
  id: authIdSchema,
  userId: authIdSchema,
  expiresAt: z.string().datetime({ offset: true }),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  ipAddress: nullableStringSchema,
  userAgent: nullableStringSchema,
  clientType: nullableStringSchema,
  impersonatedBy: nullableStringSchema,
});

export const authSessionEnvelopeSchema = z.object({
  user: authUserSchema,
  session: authSessionSchema,
});

export const nullableAuthSessionEnvelopeSchema =
  authSessionEnvelopeSchema.nullable();

export const authTransitionIntentSchema = z.enum([
  'sign-in',
  'register',
  'sign-out',
]);

export type SignInInput = z.infer<typeof signInInputSchema>;
export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type AuthSessionEnvelope = z.infer<typeof authSessionEnvelopeSchema>;
export type AuthTransitionIntent = z.infer<typeof authTransitionIntentSchema>;
