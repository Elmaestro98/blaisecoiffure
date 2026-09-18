import { defineField, defineType } from "sanity";
import TagIcon from "@sanity/icons/Tag";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom du service",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: 'appliesTo == "service" || appliesTo == "both"',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
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
      name: "priceType",
      title: "Type de tarif",
      type: "string",
      options: {
        list: [
          { title: "Prix fixe", value: "fixed" },
          { title: "À partir de", value: "from" },
        ],
      },
      initialValue: "fixed",
    }),
    defineField({
      name: "durationMinutes",
      title: "Durée (minutes)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "isPopular",
      title: "Service populaire",
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
      subtitle: "category.title",
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
