import { defineArrayMember, defineField, defineType } from "sanity";
import BasketIcon from "@sanity/icons/Basket";

export const orderType = defineType({
  name: "order",
  title: "Commande",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "reference",
      title: "Référence",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
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
      description: "Facultatif : renseigné, le client reçoit un accusé de réception.",
    }),
    defineField({
      name: "items",
      title: "Produits commandés",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem",
          fields: [
            defineField({
              name: "product",
              title: "Produit",
              type: "reference",
              to: [{ type: "product" }],
            }),
            // Nom et prix sont recopies au moment de la commande : si le
            // produit change de prix ou est supprime, la commande garde
            // les valeurs d'origine.
            defineField({ name: "name", title: "Nom", type: "string" }),
            defineField({ name: "unitPrice", title: "Prix unitaire", type: "number" }),
            defineField({ name: "quantity", title: "Quantité", type: "number" }),
            defineField({ name: "lineTotal", title: "Total ligne", type: "number" }),
          ],
          preview: {
            select: { title: "name", quantity: "quantity", subtitle: "lineTotal" },
            prepare: ({ title, quantity, subtitle }) => ({
              title: `${title} x${quantity ?? 1}`,
              subtitle: `${subtitle ?? 0} FCFA`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "total",
      title: "Total (FCFA)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "paymentMethod",
      title: "Mode de paiement",
      type: "string",
      options: {
        list: [
          { title: "À confirmer (WhatsApp)", value: "whatsapp" },
          { title: "Wave", value: "wave" },
        ],
        layout: "radio",
      },
      initialValue: "whatsapp",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Confirmée", value: "confirmed" },
          { title: "Livrée", value: "delivered" },
          { title: "Annulée", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "ID Clerk",
      type: "string",
      description: "Renseigné si le client était connecté.",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Créée le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Plus récentes",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "customerName",
      reference: "reference",
      total: "total",
      status: "status",
    },
    prepare: ({ title, reference, total, status }) => ({
      title: `${title} — ${total ?? 0} FCFA`,
      subtitle: `${reference} · ${status}`,
    }),
  },
});
