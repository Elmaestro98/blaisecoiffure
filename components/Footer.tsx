import Image from "next/image";
import Link from "next/link";
import { l1 } from "@/Image/banner";
import { Truck, Award, Banknote } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

const ACCENT = "#7A1220";

// --- Contenu éditable ---

const features = [
  {
    icon: Truck,
    title: "Livraison",
    subtitle: "En moins de 24h partout au Sénégal",
  },
  {
    icon: Award,
    title: "Authenticité Garantie",
    subtitle: "Produits de bonne qualité",
  },
  {
    icon: Banknote,
    title: "Paiement au choix",
    subtitle: "Espèces - Orange Money - Carte bancaire",
  },
];

const categories = [
  { label: "Extension", href: "categories/extension" },
  { label: "Coloration", href: "categories/coloration" },
  { label: "Pédicure et Manicure", href: "categories/pedicure-et-manicure" },
  { label: "Soin Visage", href: "categories/soins-de-visage" },
];

const infoLinks = [
  { label: "Mon compte", href: "/compte" },
  { label: "Condition d'utilisations", href: "/conditions-utilisation" },
  { label: "Livraison", href: "/livraison" },
  { label: "Politique de Retour", href: "/politique-retour" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaWhatsapp, href: "https://wa.me/221783083737", label: "WhatsApp" },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@blaiseabobade?_r=1&_t=ZS-99s6HhNV76W",
    label: "TikTok",
  },
];

// --- Composant ---

export function Footer() {
  return (
    <footer>
      <div className="bg-neutral-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 text-center sm:grid-cols-3">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon size={40} style={{ color: ACCENT }} strokeWidth={1.5} />
              <p className="mt-3 text-lg font-semibold text-neutral-900">
                {title}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src={l1}
                alt="Logo"
                width={70}
                height={70}
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-semibold" style={{ color: ACCENT }}>
                Blaise Coiffure
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral-600">
              <a
                href="mailto:blaisechoco@gmail.com"
                className="hover:underline"
              >
                blaisechoco@gmail.com
              </a>
            </p>
            <p className="mt-1 text-sm text-neutral-600">+221 77 461 50 64</p>
          </div>

          <FooterColumn title="Catégories" links={categories} />
          <FooterColumn title="Informations pratiques" links={infoLinks} />

          <div>
            <h3 className="text-lg font-semibold" style={{ color: ACCENT }}>
              Suivez-nous
            </h3>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:brightness-110"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold" style={{ color: ACCENT }}>
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-700 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
