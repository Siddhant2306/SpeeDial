import { apiRequest } from "./http";

export function placeOrder({ item, quantity = 1 }) {
  return apiRequest("/order", {
    method: "POST",
    body: { item, quantity },
  });
}

export function placeBulkOrders({ items }) {
  return apiRequest("/orders/bulk", {
    method: "POST",
    body: { items },
  });
}

