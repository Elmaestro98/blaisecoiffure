import { defineField, defineType } from "sanity";

export default defineType({
  name: "announcementBar",
  title: "Barre d'annonce",
  type: "document",
  fields: [
    defineField({
      name: "isActive",
      title: "Actif",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "intervalMs",
      title: "Intervalle (ms)",
      type: "number",
      initialValue: 3500,
    }),
    defineField({
      name: "messages",
      title: "Messages",
      type: "array",
      of: [
        defineField({
          name: "message",
          type: "object",
          fields: [
            defineField({
              name: "text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: ["shield", "truck", "creditCard", "clock", "sparkles"],
              },
            }),
            defineField({ name: "link", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});
