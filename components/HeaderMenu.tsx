"use client";

import { headerData } from "@/constants/data";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Un lien d'ancre (/#galerie) ne correspond jamais à une "page courante".
// Pour les vraies routes, /services doit rester actif sur /services/coupe-homme.
function isLinkActive(href: string, pathname: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderMenu({ isHome = false }: { isHome?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className={
        isHome
          ? "hidden items-center gap-5 text-sm font-semibold capitalize text-[#D9D9D9] lg:inline-flex xl:gap-7"
          : "hidden items-center gap-5 text-sm font-semibold capitalize text-neutral-700 lg:inline-flex xl:gap-7"
      }
    >
      {headerData.map((item) => {
        const isActive = isLinkActive(item.href, pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isHome
                ? `group relative inline-flex h-10 items-center whitespace-nowrap transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isActive ? "text-white" : ""}`
                : `group relative inline-flex h-10 items-center whitespace-nowrap transition-colors duration-300 hover:text-[#7A1220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1220]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${isActive ? "text-[#7A1220]" : "text-neutral-700"}`
            }
          >
            {item.title}
            <span
              aria-hidden="true"
              className={`absolute bottom-1 left-0 h-0.5 w-full origin-left bg-[#7A1220] transition-transform duration-300 ease-out ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default HeaderMenu;
