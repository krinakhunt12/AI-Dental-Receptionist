import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export class ServiceService {
  static async listServices(clinicId: string) {
    return prisma.service.findMany({
      where: { clinicId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  static async createService(clinicId: string, data: { name: string; description?: string; durationMins: number; price: number }) {
    return prisma.service.create({
      data: {
        clinicId,
        name: data.name,
        description: data.description,
        durationMins: data.durationMins,
        price: data.price,
      },
    });
  }

  static async updateService(clinicId: string, serviceId: string, data: any) {
    const existing = await prisma.service.findFirst({
      where: { id: serviceId, clinicId, deletedAt: null },
    });
    if (!existing) throw ApiError.notFound('Service not found');

    return prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  static async softDeleteService(clinicId: string, serviceId: string) {
    const existing = await prisma.service.findFirst({
      where: { id: serviceId, clinicId, deletedAt: null },
    });
    if (!existing) throw ApiError.notFound('Service not found');

    return prisma.service.update({
      where: { id: serviceId },
      data: { deletedAt: new Date() },
    });
  }
}
