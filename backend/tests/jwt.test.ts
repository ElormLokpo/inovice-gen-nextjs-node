import { describe, expect, test } from "bun:test";
import { generateJwt, verifyJwt } from "../src/utils/jwt.gen";

describe("jwt utilities", () => {
  test("signs and verifies auth payloads", async () => {
    process.env.JWT_SECRET = "test-secret";

    const token = await generateJwt({
      id: "user-id",
      fullName: "Demo User",
      email: "demo@example.com",
      role: "user",
      emailVerified: true,
    });

    const payload = await verifyJwt(token);

    expect(payload.id).toBe("user-id");
    expect(payload.email).toBe("demo@example.com");
    expect(payload.role).toBe("user");
    expect(payload.emailVerified).toBe(true);
  });
});
