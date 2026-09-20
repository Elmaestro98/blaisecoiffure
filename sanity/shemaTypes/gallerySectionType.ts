import { defineField, defineType } from "sanity";

export const gallerySectionType = defineType({
  name: "gallerySection",
  title: "Galerie de réalisations",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Libellé court",
      type: "string",
      initialValue: "Notre travail",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      initialValue: "Nos plus belles réalisations",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Réalisations",
      type: "array",
      validation: (Rule) => Rule.required().min(3),
      of: [
        defineField({
          name: "galleryItem",
          title: "Réalisation",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "category",
              title: "Catégorie",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "alt",
              subtitle: "category",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
    },
  },
});
