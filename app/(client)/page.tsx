import React from "react";
import Container from "@/components/Container";
import Banner from "@/components/Banner";
import FeaturedServices from "@/components/FeaturedService";
import { CategoryGrid } from "@/components/CategotyGrid";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ABOUT_SECTION_QUERY,
  GALLERY_SECTION_QUERY,
  POPULAR_SERVICES_QUERY,
  PRODUCT_CATEGORIES_QUERY,
  PRODUCTS_QUERY,
} from "@/sanity/queries";
import type { ServiceSummary } from "@/type/service";
import {
  ProductCatalog,
  type ProductCategory,
} from "@/components/ProductCatalog";
import type { ProductSummary } from "@/type/products";
import { BrandSection } from "@/components/BrandSectioni";
import { SectionPub } from "@/components/SectionPub";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

const Home = async ({ searchParams }: HomeProps) => {
  const { q = "" } = await searchParams;
  const [
    { data: servicesData },
    { data: productsData },
    { data: categoriesData },
    { data: aboutData },
    { data: galleryData },
  ] = await Promise.all([
    sanityFetch({ query: POPULAR_SERVICES_QUERY }),
    sanityFetch({ query: PRODUCTS_QUERY }),
    sanityFetch({ query: PRODUCT_CATEGORIES_QUERY }),
    sanityFetch({ query: ABOUT_SECTION_QUERY }),
    sanityFetch({ query: GALLERY_SECTION_QUERY }),
  ]);

  const services = (servicesData ?? []) as ServiceSummary[];
  const products = (productsData ?? []) as ProductSummary[];
  const categories = (categoriesData ?? []) as ProductCategory[];

  type GallerySectionContent = {
    eyebrow?: string;
    title?: string;
    items?: {
      id: string;
      src: string;
      alt: string;
      category: string;
    }[];
  };

  const gallerySection: GallerySectionContent = galleryData ?? {};

  type AboutSectionContent = {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: { asset?: { url?: string } };
    stats?: { value: string; label: string }[];
    ctaLabel?: string;
    ctaHref?: string;
    reverse?: boolean;
  };

  const aboutSection: AboutSectionContent = aboutData ?? {
    eyebrow: "À propos",
    title: "Blaise Coiffure, l'art du soin capillaire",
    description:
      "Depuis plus de 10 ans, notre équipe accompagne chaque client avec expertise et passion, dans un cadre chaleureux pensé pour sublimer chaque coupe et chaque coloration.",
    image: { asset: { url: "/images/salon-interieur.jpg" } },
    stats: [
      { value: "10+", label: "ans d'expérience" },
      { value: "500+", label: "clients satisfaits" },
      { value: "15", label: "stylistes experts" },
    ],
    ctaLabel: "Découvrir nos services",
    ctaHref: "/services",
    reverse: false,
  };

  return (
    <Container>
      <Banner />
      <CategoryGrid />
      <FeaturedServices services={services} />

      <ProductCatalog
        products={products}
        categories={categories}
        initialSearchQuery={q}
      />
      <SectionPub
        videoSrc="/videos/video-showcase.mp4"
        posterSrc="/images/salon-showcase-poster.jpg"
        eyebrow="L'expérience Blaise Coiffure"
        title="Un soin, un geste, une transformation"
        description="Découvrez notre approche du soin capillaire, entre expertise et produits de qualité."
        ctaLabel="Réserver un rendez-vous"
        ctaHref="/reservation"
      />

      <BrandSection />

      {gallerySection.items && gallerySection.items.length >= 3 ? (
        <GallerySection
          eyebrow={gallerySection.eyebrow ?? "Notre travail"}
          title={gallerySection.title ?? "Nos plus belles réalisations"}
          items={gallerySection.items}
        />
      ) : null}

      <AboutSection
        imageSrc={
          aboutSection.image?.asset?.url ?? "/images/salon-interieur.jpg"
        }
        eyebrow={aboutSection.eyebrow ?? "À propos"}
        title={
          aboutSection.title ?? "Blaise Coiffure, l'art du soin capillaire"
        }
        description={
          aboutSection.description ??
          "Depuis plus de 10 ans, notre équipe accompagne chaque client avec expertise et passion, dans un cadre chaleureux pensé pour sublimer chaque coupe et chaque coloration."
        }
        stats={
          aboutSection.stats ?? [
            { value: "+20", label: "ans d'expérience" },
            { value: "+10000", label: "clients satisfaits" },
            { value: "15", label: "stylistes experts" },
          ]
        }
        ctaLabel={aboutSection.ctaLabel ?? "Découvrir nos services"}
        ctaHref={aboutSection.ctaHref ?? "/services"}
        reverse={aboutSection.reverse ?? false}
      />
    </Container>
  );
};

export default Home;
