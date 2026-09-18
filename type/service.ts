export type ServiceCategory = {
  title: string;
  slug: string;
};

export type SanityImageLike =
  | string
  | null
  | {
      asset?: {
        url?: string | null;
      } | null;
      [key: string]: unknown;
    };

export type ServiceSummary = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: SanityImageLike;
  price: number;
  priceType: "fixed" | "from";
  durationMinutes: number;
  isPopular: boolean;
};

export type ServiceDetail = ServiceSummary & {
  category: ServiceCategory | null;
  categoryId?: string;
};
