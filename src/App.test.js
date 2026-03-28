import { PRODUCTS } from "./features/shop/products";

test("PRODUCTS has items", () => {
  expect(PRODUCTS.length).toBeGreaterThan(0);
});
