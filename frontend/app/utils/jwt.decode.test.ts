import { describe, expect, test } from "bun:test";
import { decodeJwt } from "./jwt.decode";

const base64Url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

describe("decodeJwt", () => {
  test("decodes the auth payload used by the frontend store", () => {
    const token = [
      base64Url({ alg: "HS256", typ: "JWT" }),
      base64Url({
        id: "user-id",
        fullName: "Demo User",
        role: "user",
        email: "demo@example.com",
        emailVerified: true,
      }),
      "signature",
    ].join(".");

    expect(decodeJwt(token)).toMatchObject({
      id: "user-id",
      fullName: "Demo User",
      role: "user",
      email: "demo@example.com",
      emailVerified: true,
    });
  });
});
