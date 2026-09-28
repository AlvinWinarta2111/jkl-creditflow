import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const supervisor: AuthenticatedUser = {
  id: 1,
  openId: "supervisor-test",
  email: "supervisor@example.com",
  name: "Alya Putri",
  loginMethod: "test",
  role: "supervisor",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("applications procedures", () => {
  it("returns an empty list when the optional database is unavailable", async () => {
    const caller = appRouter.createCaller(createContext(supervisor));
    const result = await caller.applications.list({ search: "Nadia" });
    expect(result).toEqual([]);
  });

  it("rejects an application with invalid required fields", async () => {
    const caller = appRouter.createCaller(createContext(supervisor));
    await expect(caller.applications.create({
      applicationNumber: "bad",
      consumerName: "",
      nik: "1",
      dealer: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehiclePrice: "0",
      tenorMonths: 6,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires authentication for application listing", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.applications.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
