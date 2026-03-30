import { apiRequest } from "./http";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const asString = String(value).trim();
    if (!asString) return;
    searchParams.set(key, asString);
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export function getProducts({ search, category } = {}) {
  return apiRequest(`/api/products${buildQuery({ search, category })}`);
}

export function getQuickCommerceProducts({ search, category } = {}) {
  return apiRequest(`/api/products${buildQuery({ search, category, source: "quickcommerceapi" })}`);
}

export function syncQuickCommerce({ query, platform, lat, lon, pincode } = {}) {
  return apiRequest("/api/sync/quickcommerce", {
    method: "POST",
    body: { query, platform, lat, lon, pincode },
  });
}
