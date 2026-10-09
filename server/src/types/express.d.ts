import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        clinicId: string | null;
        role: Role;
        email: string;
      };
      clinicId?: string;
    }
  }
}
