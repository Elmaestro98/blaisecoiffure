import { groq } from "next-sanity";

export const ANNOUNCEMENT_BAR_QUERY = groq`
  *[_type == "announcementBar" && isActive == true][0]{
    "intervalMs": coalesce(intervalMs, 3500),
    messages[]{
      _key,
      text,
      icon,
      link
    }
  }
`;

const IMAGE_PROJECTION = `{
  asset->{
    _id,
    url,
    metadata { dimensions, lqip }
  },
  crop,
  hotspot
}`;

export const SERVICE_CATEGORIES_QUERY = groq`*[
  _type == "category" &&
  appliesTo in ["service", "both"]
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  appliesTo,
  description,
  image ${IMAGE_PROJECTION}
}`;

export const PRODUCT_CATEGORIES_QUERY = groq`*[
  _type == "category" &&
  appliesTo in ["product", "both"]
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  appliesTo,
  description,
  image ${IMAGE_PROJECTION}
}`;

export const SERVICES_QUERY = groq`*[
  _type == "service" &&
  isActive != false
] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  priceType,
  durationMinutes,
  isPopular,
  order,
  image ${IMAGE_PROJECTION},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const POPULAR_SERVICES_QUERY = groq`*[
  _type == "service" &&
  isActive != false &&
  isPopular == true
] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  priceType,
  durationMinutes,
  image ${IMAGE_PROJECTION},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const SERVICE_BY_SLUG_QUERY = groq`*[
  _type == "service" &&
  slug.current == $slug &&
  isActive != false
][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  priceType,
  durationMinutes,
  isPopular,
  image ${IMAGE_PROJECTION},
  "categoryId": category->_id,
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const RELATED_SERVICES_QUERY = groq`*[
  _type == "service" &&
  isActive != false &&
  category._ref == $categoryId &&
  slug.current != $slug
] | order(coalesce(order, 9999) asc, name asc)[0...4] {
  _id,
  name,
  "slug": slug.current,
  image ${IMAGE_PROJECTION},
  price,
  priceType,
  durationMinutes,
  isPopular
}`;

export const PRODUCTS_QUERY = groq`*[
  _type == "product" &&
  isActive != false
] | order(coalesce(order, 9999) asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    _id,
    name,
    "slug": slug.current,
    logo ${IMAGE_PROJECTION}
  },
  description,
  price,
  stock,
  isFeatured,
  order,
  image ${IMAGE_PROJECTION},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const PRODUCT_BY_SLUG_QUERY = groq`*[
  _type == "product" &&
  slug.current == $slug &&
  isActive != false
][0] {
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    _id,
    name,
    "slug": slug.current,
    logo ${IMAGE_PROJECTION}
  },
  description,
  price,
  stock,
  isFeatured,
  image ${IMAGE_PROJECTION},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const PRODUCT_BY_IDENTIFIER_QUERY = groq`*[
  _type == "product" &&
  (_id == $identifier || slug.current == $identifier) &&
  isActive != false
][0] {
  _id,
  name,
  "slug": slug.current,
  "brand": brand->{
    _id,
    name,
    "slug": slug.current,
    logo ${IMAGE_PROJECTION}
  },
  description,
  price,
  stock,
  isFeatured,
  image ${IMAGE_PROJECTION},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const BOOKINGS_BY_USER_QUERY = groq`*[
  _type == "bookingRequest" &&
  (email == $email || clerkUserId == $userId)
] | order(createdAt desc) {
  _id,
  service->{_id, name, "slug": slug.current},
  serviceName,
  serviceSlug,
  clientName,
  phone,
  email,
  appointmentDate,
  appointmentTime,
  notes,
  status,
  createdAt
}`;

export const BOOKINGS_QUERY = groq`*[
  _type == "bookingRequest"
] | order(createdAt desc) {
  _id,
  service->{_id, name, "slug": slug.current},
  serviceName,
  serviceSlug,
  clientName,
  phone,
  email,
  appointmentDate,
  appointmentTime,
  notes,
  status,
  createdAt
}`;

export const ALL_CATEGORIES_QUERY = groq`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  appliesTo,
  description,
  image ${IMAGE_PROJECTION}
}`;

export const PRODUCT_CATEGORIES_WITH_PRODUCTS_QUERY = groq`*[
  _type == "category" &&
  appliesTo in ["product", "both"] &&
  count(*[
    _type == "product" &&
    isActive != false &&
    references(^._id)
  ]) > 0
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  appliesTo,
  description,
  image ${IMAGE_PROJECTION}
}`;

export const BRANDS_QUERY = groq`*[
  _type == "brand" &&
  isActive != false
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  logo ${IMAGE_PROJECTION}
}`;
