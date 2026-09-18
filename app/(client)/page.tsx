import React from "react";
import Container from "@/components/Container";
import Banner from "@/components/Banner";
import FeaturedServices from "@/components/FeaturedService";
import { sanityFetch } from "@/sanity/lib/live";
import {
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

const Home = async () => {
  const [
    { data: servicesData },
    { data: productsData },
    { data: categoriesData },
  ] = await Promise.all([
    sanityFetch({ query: POPULAR_SERVICES_QUERY }),
    sanityFetch({ query: PRODUCTS_QUERY }),
    sanityFetch({ query: PRODUCT_CATEGORIES_QUERY }),
  ]);

  const services = (servicesData ?? []) as ServiceSummary[];
  const products = (productsData ?? []) as ProductSummary[];
  const categories = (categoriesData ?? []) as ProductCategory[];

  return (
    <Container>
      <Banner />
      <FeaturedServices services={services} />
      <ProductCatalog products={products} categories={categories} />
    </Container>
  );
};

export default Home;
