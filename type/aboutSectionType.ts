type SanityImageLike = {
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { lqip?: string };
  };
};

export type AboutSectionProps = {
  imageSrc: string | SanityImageLike;
  eyebrow?: string;
  title: string;
  description: string;
  stats?: { value: string; label: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  reverse?: boolean;
};
