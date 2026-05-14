import { describe, expect, test } from "bun:test";
import { comparePassword, hashPassword } from "../src/utils/hash";

describe("password hashing", () => {
  test("hashes and verifies passwords", async () => {
    const hash = await hashPassword("secure-password");

    expect(hash).not.toBe("secure-password");
    expect(await comparePassword("secure-password", hash)).toBe(true);
    expect(await comparePassword("wrong-password", hash)).toBe(false);
  });
});
