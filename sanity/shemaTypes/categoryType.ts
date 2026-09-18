import { defineField, defineType } from "sanity";
import TagIcon from "@sanity/icons/Tag";

export const categoryType = defineType({
  name: "category",
  title: "category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appliesTo",
      title: "S'applique à",
      type: "string",
      options: {
        list: [
          { title: "Produits", value: "product" },
          { title: "Services", value: "service" },
          { title: "Les deux", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "product",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "range",
      type: "number",
      description: "Starting From",
      hidden: ({ document }) => document?.appliesTo === "service",
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "appliesTo",
      media: "image",
    },
  },
});
