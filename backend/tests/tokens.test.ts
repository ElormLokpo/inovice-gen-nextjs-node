import { describe, expect, test } from "bun:test";
import { createPlainToken, hashToken } from "../src/utils/tokens";

describe("reset and confirmation tokens", () => {
  test("creates random plain tokens and stable hashes", () => {
    const firstToken = createPlainToken();
    const secondToken = createPlainToken();

    expect(firstToken).toHaveLength(64);
    expect(secondToken).toHaveLength(64);
    expect(firstToken).not.toBe(secondToken);
    expect(hashToken(firstToken)).toBe(hashToken(firstToken));
    expect(hashToken(firstToken)).not.toBe(firstToken);
  });
});
