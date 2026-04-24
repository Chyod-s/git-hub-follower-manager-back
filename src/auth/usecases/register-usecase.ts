import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import { hashPassword } from '../../utils/password';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[^\x00<>'"\\]+$/, 'Name contains invalid characters')
    .transform((v) => v.trim()),
  email: z
    .string()
    .email('Invalid email address')
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterInput): Promise<{ created: boolean }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      await hashPassword(input.password);
      return { created: false };
    }

    const passwordHash = await hashPassword(input.password);

    try {
      await this.userRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
      });
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code !== 'P2002') throw err;
    }

    return { created: true };
  }
}
