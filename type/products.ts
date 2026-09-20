import type { SanityImageLike } from "./service";

export type ProductSummary = {
  _id: string;
  name: string;
  slug: string;
  image: SanityImageLike;
  price: number;
  stock: number;
  isFeatured: boolean;
  category?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  brand?: {
    _id: string;
    name: string;
    slug: string;
    logo?: SanityImageLike;
  } | null;
};

export type ProductDetail = ProductSummary & {
  description?: string;
};
