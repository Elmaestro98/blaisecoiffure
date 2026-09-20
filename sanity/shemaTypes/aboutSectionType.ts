import { defineField, defineType } from "sanity";

export const aboutSectionType = defineType({
  name: "aboutSection",
  title: "Section À propos",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Libellé court",
      type: "string",
      initialValue: "À propos",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Libellé du bouton",
      type: "string",
    }),
    defineField({
      name: "ctaHref",
      title: "Lien du bouton",
      type: "string",
    }),
    defineField({
      name: "reverse",
      title: "Image à droite",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "stats",
      title: "Statistiques",
      type: "array",
      of: [
        defineField({
          name: "stat",
          type: "object",
          fields: [
            defineField({
              name: "value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
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
