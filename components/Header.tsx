"use client";

import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import useStore from "@/store";
import type { ProductSummary } from "@/type/products";

type HeaderProps = {
  products: ProductSummary[];
};

const Header = ({ products }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHome = pathname === "/";

  const urlQuery = searchParams.get("q") ?? "";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Synchronisation URL -> input pendant le rendu (pas d'effet, pas de rendu en cascade).
  // On ne réécrit pas l'input si l'URL correspond déjà à sa valeur "trimmée" (garde les espaces en fin de saisie).
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== searchQuery.trim()) {
      setSearchQuery(urlQuery);
    }
  }

  const cartItemCount = useStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const openCart = useStore((state) => state.openCart);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("fr-FR");
  const suggestions = normalizedQuery
    ? products
        .filter((product) =>
          (product.name ?? "")
            .toLocaleLowerCase("fr-FR")
            .includes(normalizedQuery),
        )
        .slice(0, 5)
    : [];

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    const query = value.trim();

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString()
      ? `/?${params.toString()}#produits`
      : "/#produits";
    router.replace(nextUrl, { scroll: false });
  };

  const closeSearch = () => setIsSearchOpen(false);

  const iconBtn =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition sm:h-10 sm:w-10";
  const iconTone = isHome
    ? "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-[#1A0A0D]"
    : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100";
  const cartTone = isHome
    ? "border border-white/20 bg-white text-[#1A0A0D] hover:bg-[#F1C8C8]"
    : "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-2 z-30 text-white sm:top-3"
          : "relative z-30 border-b border-neutral-200 bg-white text-neutral-900 shadow-sm"
      }
    >
      <Container className="flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-5">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo1.png"
            alt="Blaise Coiffure"
            width={180}
            height={180}
            className={
              isHome
                ? "h-14 w-14 object-contain sm:h-24 sm:w-24"
                : "h-12 w-12 object-contain sm:h-20 sm:w-20"
            }
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Menu"
            className={
              isHome
                ? "shrink-0 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 md:hidden"
                : "shrink-0 rounded-full bg-neutral-100 p-2 text-neutral-800 transition hover:bg-neutral-200 md:hidden"
            }
          >
            <Menu className="h-5 w-5" />
          </button>

          <HeaderMenu isHome={isHome} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {isSearchOpen ? (
            <div className="fixed inset-x-3 top-3 z-50 sm:relative sm:inset-auto sm:z-auto">
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex items-center gap-2 rounded-full bg-white p-1 shadow-lg sm:bg-transparent sm:p-0 sm:shadow-none"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => updateSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") closeSearch();
                  }}
                  placeholder="Rechercher un produit"
                  aria-label="Rechercher un produit"
                  className="h-10 min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none ring-[#B8283A] focus:ring-2 sm:w-56 sm:flex-none"
                />
                <button
                  type="button"
                  aria-label="Fermer la recherche"
                  onClick={closeSearch}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#B8283A] text-white transition hover:brightness-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>

              {suggestions.length ? (
                <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 text-neutral-900 shadow-xl sm:left-auto sm:right-0 sm:w-72">
                  {suggestions.map((product) => (
                    <Link
                      key={product._id}
                      href={`/produits/${product.slug}`}
                      onClick={closeSearch}
                      className="block px-4 py-3 text-left text-sm transition hover:bg-[#F4E2E5]"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setIsSearchOpen(true)}
              className={`${iconBtn} ${iconTone}`}
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={openCart}
            aria-label="Panier"
            className={`relative ${iconBtn} ${cartTone}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#B8283A] text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          </button>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                aria-label="Connexion"
                className={`${iconBtn} ${iconTone}`}
              >
                <User className="h-4 w-4" />
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9 border border-white shadow-sm sm:h-10 sm:w-10",
                    userButtonPopoverCard: "shadow-xl",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </Container>
    </header>
  );
};

export default Header;
