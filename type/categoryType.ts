// types/category.ts
export type Category = {
  _id: string;
  title: string;
  slug: string;
  appliesTo: "product" | "service" | "both";
  description?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
      metadata: { dimensions: { width: number; height: number }; lqip: string };
    };
    crop?: unknown;
    hotspot?: unknown;
  };
};
