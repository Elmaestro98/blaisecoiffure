import { defineField, defineType } from "sanity";
import TagIcon from "@sanity/icons/Tag";

export const productType = defineType({
  name: "product",
  title: "Produit cosmétique",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom du produit",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Marque",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: 'appliesTo == "product" || appliesTo == "both"',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "price",
      title: "Prix (FCFA)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "stock",
      title: "Stock disponible",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "isFeatured",
      title: "Produit mis en avant",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Actif (visible sur le site)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "brand.name",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
