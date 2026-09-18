"use client";

import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import HeaderMenu from "./HeaderMenu";

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

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
          <button
            aria-label="Rechercher"
            className={
              isHome
                ? "grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#1A0A0D]"
                : "grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100"
            }
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            aria-label="Panier"
            className={
              isHome
                ? "relative hidden h-10 w-10 place-items-center rounded-full border border-white/20 bg-white text-[#1A0A0D] transition hover:bg-[#F1C8C8] sm:grid"
                : "relative hidden h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:bg-neutral-100 sm:grid"
            }
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#B8283A] text-[10px] font-bold text-white">
              0
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
