"use client";

import { headerData } from "@/constants/data";
import { usePathname } from "next/navigation";
import Link from "next/link";

function HeaderMenu({ isHome = false }: { isHome?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className={
        isHome
          ? "hidden items-center gap-7 text-sm font-semibold capitalize text-[#D9D9D9] md:inline-flex"
          : "hidden items-center gap-7 text-sm font-semibold capitalize text-neutral-700 md:inline-flex"
      }
    >
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          aria-current={pathname === item?.href ? "page" : undefined}
          className={
            isHome
              ? `group relative inline-flex h-10 items-center transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${pathname === item?.href ? "text-white" : ""}`
              : `group relative inline-flex h-10 items-center transition-colors duration-300 hover:text-[#7A1220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1220]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${pathname === item?.href ? "text-[#7A1220]" : "text-neutral-700"}`
          }
        >
          {item?.title}
          <span
            aria-hidden="true"
            className={
              isHome
                ? `absolute bottom-1 left-0 h-0.5 origin-left bg-[#7A1220] transition-transform duration-300 ease-out ${pathname === item?.href ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"}`
                : `absolute bottom-1 left-0 h-0.5 origin-left bg-[#7A1220] transition-transform duration-300 ease-out ${pathname === item?.href ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"}`
            }
          />
        </Link>
      ))}
    </nav>
  );
}

export default HeaderMenu;
