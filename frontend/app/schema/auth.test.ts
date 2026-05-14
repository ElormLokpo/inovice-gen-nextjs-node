import { describe, expect, test } from "bun:test";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "./index";

describe("auth schemas", () => {
  test("accepts valid login credentials", () => {
    expect(LoginSchema.safeParse({ email: "demo@example.com", password: "pass1234" }).success).toBe(true);
  });

  test("requires a valid registration payload", () => {
    expect(RegisterSchema.safeParse({ email: "demo@example.com", password: "pass1234", fullName: "Demo User" }).success).toBe(true);
    expect(RegisterSchema.safeParse({ email: "demo", password: "x", fullName: "" }).success).toBe(false);
  });

  test("accepts forgot password email", () => {
    expect(ForgotPasswordSchema.safeParse({ email: "demo@example.com" }).success).toBe(true);
  });

  test("requires matching reset passwords", () => {
    expect(
      ResetPasswordSchema.safeParse({
        token: "reset-token",
        password: "pass1234",
        confirmPassword: "pass1234",
      }).success,
    ).toBe(true);

    expect(
      ResetPasswordSchema.safeParse({
        token: "reset-token",
        password: "pass1234",
        confirmPassword: "different",
      }).success,
    ).toBe(false);
  });
});
