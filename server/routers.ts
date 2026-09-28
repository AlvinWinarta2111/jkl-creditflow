import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createCreditApplication,
  listApplicationAuditEvents,
  listApplicationDocuments,
  listCreditApplications,
  updateCreditApplicationStatus,
} from "./db";

const applicationStatus = z.enum(["draft", "submitted", "approved", "docs_generated", "signed_uploaded", "disbursed", "rejected"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  applications: router({
    list: protectedProcedure.input(z.object({ search: z.string().optional(), status: applicationStatus.optional() }).optional()).query(({ input }) => listCreditApplications(input)),
    create: protectedProcedure.input(z.object({
      applicationNumber: z.string().min(5).max(32),
      consumerName: z.string().min(2),
      nik: z.string().min(8).max(32),
      dealer: z.string().min(2),
      vehicleBrand: z.string().min(2),
      vehicleModel: z.string().min(2),
      vehicleType: z.string().optional(),
      vehicleColor: z.string().optional(),
      vehiclePrice: z.string(),
      downPayment: z.string().optional(),
      tenorMonths: z.number().int().min(12).max(84),
      monthlyInstallment: z.string().optional(),
      insurance: z.string().optional(),
    })).mutation(({ input, ctx }) => createCreditApplication({ ...input, status: "draft", createdBy: ctx.user.id })),
    updateStatus: protectedProcedure.input(z.object({ id: z.number().int(), status: applicationStatus, note: z.string().max(500).optional() })).mutation(({ input, ctx }) => updateCreditApplicationStatus(input.id, input.status, ctx.user.id, input.note)),
  }),
  documents: router({
    list: protectedProcedure.input(z.object({ applicationId: z.number().int() })).query(({ input }) => listApplicationDocuments(input.applicationId)),
  }),
  audit: router({
    list: protectedProcedure.input(z.object({ applicationId: z.number().int() })).query(({ input }) => listApplicationAuditEvents(input.applicationId)),
  }),
});

export type AppRouter = typeof appRouter;
