import { defineField, defineType } from "sanity";
import CalendarIcon from "@sanity/icons/Calendar";

export const bookingRequestType = defineType({
  name: "bookingRequest",
  title: "Demande de rendez-vous",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "service",
      title: "Service",
      type: "reference",
      to: [{ type: "service" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "serviceName",
      title: "Nom du service",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "serviceSlug",
      title: "Slug du service",
      type: "string",
    }),
    defineField({
      name: "clientName",
      title: "Nom du client",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appointmentDate",
      title: "Date du rendez-vous",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appointmentTime",
      title: "Heure du rendez-vous",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Informations complémentaires",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Confirmé", value: "confirmed" },
          { title: "Annulé", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "clerkUserId",
      title: "ID Clerk",
      type: "string",
    }),
    defineField({
      name: "createdAt",
      title: "Date de création",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "serviceName",
      media: "service.image",
    },
  },
});
