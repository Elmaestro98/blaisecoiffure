"use client";

import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const cartItemCount = useStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const openCart = useStore((state) => state.openCart);
  const suggestions = searchQuery.trim().length
    ? products
        .filter((product) =>
          product.name
            .toLocaleLowerCase("fr-FR")
            .includes(searchQuery.trim().toLocaleLowerCase("fr-FR")),
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

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

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-3 z-30 text-white"
          : "relative z-30 border-b border-neutral-200 bg-white text-neutral-900 shadow-sm"
      }
    >
      <Container className="flex items-center justify-around py-5 sm:py-6">
        <Link href="/" className="justify-self-center">
          <Image
            src="/logo1.png"
            alt="Blaise Coiffure"
            width={180}
            height={180}
            className={
              isHome
                ? "h-[72px] w-[72px] object-contain sm:h-24 sm:w-24"
                : "h-[58px] w-[58px] object-contain sm:h-20 sm:w-20"
            }
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            className={
              isHome
                ? "rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 md:hidden"
                : "rounded-full bg-neutral-100 p-2.5 text-neutral-800 transition hover:bg-neutral-200 md:hidden"
            }
          >
            <Menu className="h-5 w-5" />
          </button>

          <HeaderMenu isHome={isHome} />
        </div>

        <div className="flex justify-self-end gap-2">
          {isSearchOpen ? (
            <div className="relative">
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Rechercher un produit"
                  aria-label="Rechercher un produit"
                  className="h-10 w-40 rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none ring-[#B8283A] focus:ring-2 sm:w-56"
                />
                <button
                  type="button"
                  aria-label="Fermer la recherche"
                  onClick={() => setIsSearchOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#B8283A] text-white transition hover:brightness-110"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {suggestions.length ? (
                <div className="absolute right-12 top-12 z-50 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 text-neutral-900 shadow-xl">
                  {suggestions.map((product) => (
                    <Link
                      key={product._id}
                      href={`/produits/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
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
              className={
                isHome
                  ? "grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#1A0A0D]"
                  : "grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100"
              }
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={openCart}
            aria-label="Panier"
            className={
              isHome
                ? "relative hidden h-10 w-10 place-items-center rounded-full border border-white/20 bg-white text-[#1A0A0D] transition hover:bg-[#F1C8C8] sm:grid"
                : "relative hidden h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 sm:grid"
            }
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#B8283A] text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          </button>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <span
                aria-label="Connexion"
                className={
                  isHome
                    ? "hidden h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#1A0A0D] md:grid"
                    : "hidden h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 md:grid"
                }
              >
                <User className="h-4 w-4" />
              </span>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 border border-white shadow-sm",
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
