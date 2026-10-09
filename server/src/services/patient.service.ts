import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  medicalNotes?: string;
}

export class PatientService {
  static async listPatients(clinicId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      clinicId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getPatientById(clinicId: string, patientId: string) {
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        clinicId,
        deletedAt: null,
      },
      include: {
        appointments: {
          orderBy: { startTime: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      throw ApiError.notFound('Patient not found');
    }

    return patient;
  }

  static async createPatient(clinicId: string, input: CreatePatientInput) {
    const dob = input.dateOfBirth ? new Date(input.dateOfBirth) : undefined;
    const patient = await prisma.patient.create({
      data: {
        clinicId,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        dateOfBirth: dob,
        gender: input.gender,
        address: input.address,
        medicalNotes: input.medicalNotes,
      },
    });

    return patient;
  }

  static async updatePatient(clinicId: string, patientId: string, input: Partial<CreatePatientInput>) {
    await this.getPatientById(clinicId, patientId);

    const updateData: any = { ...input };
    if (input.dateOfBirth) {
      updateData.dateOfBirth = new Date(input.dateOfBirth);
    }

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: updateData,
    });

    return updated;
  }

  static async softDeletePatient(clinicId: string, patientId: string) {
    await this.getPatientById(clinicId, patientId);

    await prisma.patient.update({
      where: { id: patientId },
      data: { deletedAt: new Date() },
    });

    return true;
  }
}
