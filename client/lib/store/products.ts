/** For store filter dropdown (includes "all"). */
export const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "general", label: "General" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Living" },
  { value: "sports", label: "Sports" },
] as const;

/** For add-product form (no "all"). */
export const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c.value !== "all");