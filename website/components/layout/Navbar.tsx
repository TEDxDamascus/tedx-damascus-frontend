"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { eventsApi } from "@/lib/api/client";

interface NavbarProps {
  locale: string;
  navRef?: React.RefObject<HTMLElement | null>;
}

const NAV_ITEMS = [
  { key: "home", href: "/home" },
  { key: "events", href: "/events" },
  { key: "speakers", href: "/speakers" },
  { key: "team", href: "/team" },
  { key: "partners", href: "/partners" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

/** These nav items open a dropdown of TEDx edition years instead of linking directly. */
const YEAR_DROPDOWN_KEYS = new Set<NavKey>(["team", "speakers", "partners"]);

interface DropdownChild {
  label: string;
  href: string;
}

function SyrianFlag() {
  return (
    <div className="w-6 h-6 relative overflow-hidden shrink-0">
      <div
        className="absolute left-0 w-full h-[5.33px] bg-[#007A3D]"
        style={{ top: 3.33 }}
      />
      <div
        className="absolute left-0 w-full h-[6.67px] bg-[#F1F1F1]"
        style={{ top: 8.67 }}
      />
      <div
        className="absolute left-0 w-full h-[5.33px] bg-[#101010]"
        style={{ top: 15.33 }}
      />
      <div
        className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]"
        style={{ left: 4.67, top: 10 }}
      />
      <div
        className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]"
        style={{ left: 10, top: 10 }}
      />
      <div
        className="absolute w-[3.57px] h-[3.40px] bg-[#EB0028]"
        style={{ left: 15.33, top: 10 }}
      />
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between">
      <motion.span
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
        className="block h-0.5 w-full bg-white origin-center"
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
        className="block h-0.5 w-full bg-white origin-center"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
        className="block h-0.5 w-full bg-white origin-center"
      />
    </div>
  );
}

export function Navbar({ locale, navRef }: NavbarProps) {
  const t = useTranslations("Navigation");
  const rawPathname = usePathname();
  const pathname = rawPathname.endsWith("/")
    ? rawPathname.slice(0, -1)
    : rawPathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "") || "/";
  const isRtl = locale === "ar";

  const altLocale = isRtl ? "en" : "ar";
  const altHref =
    `/${altLocale}${pathname.replace(/^\/(en|ar)/, "")}` || `/${altLocale}`;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<NavKey | null>(null);
  const [mobileExpandedKey, setMobileExpandedKey] = useState<NavKey | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const dropdownRefs = useRef<Partial<Record<NavKey, HTMLDivElement | null>>>({});

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpandedKey(null);
    setOpenKey(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Distinct TEDx edition years, derived from the events calendar, used to
  // populate the Team/Speakers/Partners year dropdowns.
  useEffect(() => {
    eventsApi
      .getAll()
      .then((res: any) => {
        const raw: any[] = Array.isArray(res) ? res : (res?.data ?? []);
        const ys = Array.from(
          new Set(
            raw
              .map((e) => {
                const d = new Date(e.date ?? e.startDate ?? "");
                return Number.isNaN(d.getTime()) ? null : d.getFullYear();
              })
              .filter((y): y is number => y !== null)
          )
        ).sort((a, b) => b - a);
        setYears(ys);
      })
      .catch(() => setYears([]));
  }, []);

  useEffect(() => {
    if (!openKey) return;
    function handlePointerDown(e: MouseEvent) {
      const el = dropdownRefs.current[openKey!];
      if (el && !el.contains(e.target as Node)) setOpenKey(null);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenKey(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openKey]);

  function childrenFor(key: NavKey, href: string): DropdownChild[] {
    if (key === "about") {
      return [
        { label: t("about"), href: "/about" },
        { label: t("ourStory"), href: "/about/our-story" },
      ];
    }
    return [
      { label: t("allYears"), href },
      ...years.map((y) => ({ label: String(y), href: `${href}?year=${y}` })),
    ];
  }

  const langContent = isRtl ? (
    <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">
      EN
    </span>
  ) : (
    <>
      <span className="font-helvetica text-base font-normal text-[#F1F1F1] leading-6 tracking-[0.15px]">
        عربي
      </span>
      <SyrianFlag />
    </>
  );

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-[80px] py-4">
        <div dir="ltr">
          <Link
            href={`/${locale}/home`}
            className="sm:hidden inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
          >
            <Image
              src="/images/icons/tedx-logo.png"
              alt="TEDxDamascus"
              width={55}
              height={32}
              priority
              className="object-contain [grid-column:1] [grid-row:1]"
            />
            <span className="[grid-column:1] [grid-row:1] ml-[57px] mt-[9px] text-[19px] font-helvetica font-light text-white leading-none select-none">
              Damascus
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[4px] mt-[25px] text-[11px] font-helvetica font-black text-primary leading-none select-none">
              x
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[14px] mt-[27px] text-[7px] font-helvetica font-bold text-white leading-none select-none">
              = independently organized TED event
            </span>
          </Link>

          <Link
            href={`/${locale}/home`}
            className="hidden sm:inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start [direction:ltr]"
          >
            <Image
              src="/images/icons/tedx-logo.png"
              alt="TEDxDamascus"
              width={100}
              height={58}
              className="object-contain [grid-column:1] [grid-row:1]"
              priority
            />
            <span className="[grid-column:1] [grid-row:1] ml-[104px] mt-[17px] text-[34px] font-helvetica font-light text-white leading-none select-none">
              Damascus
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[7px] mt-[51px] text-[13px] font-helvetica font-black text-primary leading-none select-none">
              x
            </span>
            <span className="[grid-column:1] [grid-row:1] ml-[17px] mt-[51px] text-[13px] font-helvetica font-bold text-white leading-none select-none">
              = independently organized TED event
            </span>
          </Link>
        </div>

        <div className="flex items-center">
          <nav
            ref={navRef as React.RefObject<HTMLElement>}
            className="hidden xl:flex items-center gap-5 2xl:gap-7 pt-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ key, href }) => {
              const fullHref = `/${locale}${href}`;

              const isPartnersActive =
                key === "partners" &&
                (pathname === fullHref ||
                  pathWithoutLocale === href ||
                  pathname.includes(`/${locale}/partner/`) ||
                  pathWithoutLocale.startsWith("/partner/"));

              const isAboutActive =
                key === "about" &&
                (pathWithoutLocale === "/about" ||
                  pathWithoutLocale.startsWith("/about/"));

              const isActive =
                isPartnersActive ||
                isAboutActive ||
                pathname === fullHref ||
                pathWithoutLocale === href ||
                (key !== "about" && pathWithoutLocale.startsWith(href + "/")) ||
                (key === "home" &&
                  (pathname === `/${locale}` ||
                    pathWithoutLocale === "/" ||
                    pathWithoutLocale === ""));

              const hasDropdown = key === "about" || YEAR_DROPDOWN_KEYS.has(key);

              if (!hasDropdown) {
                return (
                  <Link
                    key={key}
                    href={fullHref}
                    dir="ltr"
                    className={[
                      "flex items-center gap-0.5 font-sans text-base font-normal tracking-[0.15px] transition-colors duration-200 cursor-pointer",
                      isActive ? "text-primary" : "text-[#F1F1F1] hover:opacity-80",
                    ].join(" ")}
                  >
                    {isActive && (
                      <Image
                        src="/images/hero/indicator.png"
                        alt=""
                        width={28}
                        height={28}
                        aria-hidden
                      />
                    )}
                    <span dir={isRtl ? "rtl" : "ltr"}>{t(key)}</span>
                  </Link>
                );
              }

              const isOpen = openKey === key;
              const children = childrenFor(key, href);

              return (
                <div
                  key={key}
                  className="relative"
                  ref={(el) => {
                    dropdownRefs.current[key] = el;
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey((k) => (k === key ? null : key))}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    dir="ltr"
                    className={[
                      "flex items-center gap-1 font-sans text-base font-normal tracking-[0.15px] transition-colors duration-200 cursor-pointer",
                      isActive ? "text-primary" : "text-[#F1F1F1] hover:opacity-80",
                    ].join(" ")}
                  >
                    {isActive && (
                      <Image
                        src="/images/hero/indicator.png"
                        alt=""
                        width={28}
                        height={28}
                        aria-hidden
                      />
                    )}
                    <span dir={isRtl ? "rtl" : "ltr"}>{t(key)}</span>
                    <ChevronDown
                      size={14}
                      className={[
                        "transition-transform duration-200",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                      aria-hidden
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        role="menu"
                        className={[
                          "absolute top-full mt-3 z-20 min-w-[160px] border border-white/10 bg-[#151515] py-2 shadow-xl",
                          isRtl ? "right-0" : "left-0",
                        ].join(" ")}
                      >
                        {children.map((child) => (
                          <Link
                            key={child.href}
                            href={`/${locale}${child.href}`}
                            role="menuitem"
                            onClick={() => setOpenKey(null)}
                            className="block px-4 py-2 font-sans text-sm text-[#F1F1F1] transition-colors hover:bg-white/5 hover:text-primary whitespace-nowrap"
                          >
                            <span dir={isRtl ? "rtl" : "ltr"}>{child.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <Link
              href={altHref}
              aria-label={isRtl ? "Switch to English" : "التحويل إلى العربية"}
              className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              {langContent}
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="xl:hidden flex items-center justify-center w-10 h-10"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -30 : 30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#101010] flex flex-col overflow-y-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="h-1 w-full bg-[#EB0028] shrink-0" />
            <nav
              className="flex flex-col flex-1 justify-center px-8 py-10 gap-5"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map(({ key, href }, i) => {
                const fullHref = `/${locale}${href}`;

                const isPartnersActive =
                  key === "partners" &&
                  (pathname === fullHref ||
                    pathWithoutLocale === href ||
                    pathname.includes(`/${locale}/partner/`) ||
                    pathWithoutLocale.startsWith("/partner/"));

                const isAboutActive =
                  key === "about" &&
                  (pathWithoutLocale === "/about" ||
                    pathWithoutLocale.startsWith("/about/"));

                const isActive =
                  isPartnersActive ||
                  isAboutActive ||
                  pathname === fullHref ||
                  pathWithoutLocale === href ||
                  pathWithoutLocale.startsWith(href + "/") ||
                  (key === "home" &&
                    (pathname === `/${locale}` ||
                      pathWithoutLocale === "/" ||
                      pathWithoutLocale === ""));

                const hasDropdown = key === "about" || YEAR_DROPDOWN_KEYS.has(key);

                if (!hasDropdown) {
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 + 0.05, duration: 0.22 }}
                    >
                      <Link
                        href={fullHref}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "font-helvetica text-3xl font-light block py-0.5 transition-colors",
                          isActive
                            ? "text-[#EB0028]"
                            : "text-[#F1F1F1] hover:text-[#EB0028]",
                        ].join(" ")}
                      >
                        <span dir={isRtl ? "rtl" : "ltr"}>{t(key)}</span>
                      </Link>
                    </motion.div>
                  );
                }

                const isExpanded = mobileExpandedKey === key;
                const children = childrenFor(key, href);

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 + 0.05, duration: 0.22 }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedKey((k) => (k === key ? null : key))
                      }
                      aria-expanded={isExpanded}
                      className={[
                        "flex w-full items-center justify-between gap-2 font-helvetica text-3xl font-light py-0.5 transition-colors",
                        isActive
                          ? "text-[#EB0028]"
                          : "text-[#F1F1F1] hover:text-[#EB0028]",
                      ].join(" ")}
                    >
                      <span dir={isRtl ? "rtl" : "ltr"}>{t(key)}</span>
                      <ChevronDown
                        size={22}
                        className={[
                          "transition-transform duration-200 shrink-0",
                          isExpanded ? "rotate-180" : "",
                        ].join(" ")}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          key="mobile-dropdown"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={[
                            "flex flex-col gap-3 mt-3 overflow-hidden",
                            isRtl ? "border-e border-white/10 pe-4" : "border-s border-white/10 ps-4",
                          ].join(" ")}
                        >
                          {children.map((child) => (
                            <Link
                              key={child.href}
                              href={`/${locale}${child.href}`}
                              onClick={() => setMobileOpen(false)}
                              className="font-helvetica text-lg text-white/70 transition-colors hover:text-primary"
                            >
                              <span dir={isRtl ? "rtl" : "ltr"}>{child.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-8 pb-10">
              <Link
                href={altHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-[#F1F1F1] hover:opacity-70 transition-opacity"
              >
                {langContent}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
