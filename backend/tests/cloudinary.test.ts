import { describe, expect, test } from "bun:test";
import { parseCloudinaryUrl } from "../src/services/cloudinary.service";

describe("cloudinary config", () => {
  test("parses CLOUDINARY_URL into upload config", () => {
    const config = parseCloudinaryUrl("cloudinary://key%201:secret%202@dkgoymxzp");

    expect(config).toEqual({
      apiKey: "key 1",
      apiSecret: "secret 2",
      cloudName: "dkgoymxzp",
    });
  });
});
