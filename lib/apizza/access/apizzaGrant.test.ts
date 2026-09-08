import { createApizzaGrantToken, hasValidApizzaGrant, verifyApizzaPassword } from "./apizzaGrant";

describe("apizzaGrant", () => {
  it("accepts the site password", () => {
    expect(verifyApizzaPassword("timon")).toBe(true);
    expect(verifyApizzaPassword("wrong")).toBe(false);
  });

  it("issues and validates grant tokens", () => {
    const token = createApizzaGrantToken();
    expect(hasValidApizzaGrant(token)).toBe(true);
    expect(hasValidApizzaGrant(undefined)).toBe(false);
    expect(hasValidApizzaGrant("apizza.invalid")).toBe(false);
  });
});
