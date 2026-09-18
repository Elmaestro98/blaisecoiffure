import { defineField, defineType } from "sanity";
import TagIcon from "@sanity/icons/Tag";

export const brandType = defineType({
  name: "brand",
  title: "Marque cosmétique",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nom de la marque",
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
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "website",
      title: "Site web",
      type: "url",
    }),
    defineField({
      name: "isActive",
      title: "Actif",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
