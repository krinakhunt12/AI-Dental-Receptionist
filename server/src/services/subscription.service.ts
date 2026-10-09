import { prisma } from '../prisma.js';
import { ApiError } from '../utils/apiError.js';
import { BillingPeriod, SubscriptionStatus } from '@prisma/client';

export class SubscriptionService {
  static async listPlans() {
    return prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });
  }

  static async getClinicSubscription(clinicId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { clinicId },
      include: {
        plan: true,
        invoices: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!subscription) throw ApiError.notFound('Subscription not found');
    return subscription;
  }

  static async upgradeOrChangePlan(clinicId: string, planCode: string, billingPeriod: BillingPeriod = BillingPeriod.MONTHLY) {
    const plan = await prisma.plan.findUnique({
      where: { code: planCode },
    });

    if (!plan || !plan.isActive) {
      throw ApiError.badRequest('Invalid or inactive plan selected');
    }

    const currentSub = await prisma.subscription.findUnique({
      where: { clinicId },
    });

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingPeriod === BillingPeriod.MONTHLY) {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const price = billingPeriod === BillingPeriod.MONTHLY ? plan.priceMonthly : plan.priceYearly;

    const updated = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.upsert({
        where: { clinicId },
        update: {
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          billingPeriod,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelledAt: null,
        },
        create: {
          clinicId,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          billingPeriod,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
        include: { plan: true },
      });

      // Generate Invoice record
      if (Number(price) > 0) {
        await tx.invoice.create({
          data: {
            clinicId,
            subscriptionId: sub.id,
            amount: price,
            currency: 'USD',
            status: 'paid',
            paymentGateway: 'stripe',
            paidAt: now,
          },
        });
      }

      return sub;
    });

    return updated;
  }

  static async cancelSubscription(clinicId: string) {
    const currentSub = await prisma.subscription.findUnique({
      where: { clinicId },
    });

    if (!currentSub) throw ApiError.notFound('Subscription not found');

    const updated = await prisma.subscription.update({
      where: { clinicId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      include: { plan: true },
    });

    return updated;
  }

  static async listInvoices(clinicId: string) {
    return prisma.invoice.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
