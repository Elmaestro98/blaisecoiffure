// types/brand.ts
export type Brand = {
  _id: string;
  name: string;
  slug: string;
  logo?: {
    asset: {
      _id: string;
      url: string;
      metadata: { dimensions: { width: number; height: number }; lqip: string };
    };
  };
};
