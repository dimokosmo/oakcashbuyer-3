"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "../../../lib/analytics";

type CityCtaLinkProps = {
  href: string;
  citySlug: string;
  ctaLabel: string;
  className?: string;
  children: ReactNode;
};

export function CityCtaLink({
  href,
  citySlug,
  ctaLabel,
  className,
  children,
}: CityCtaLinkProps) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() =>
        trackEvent("city_page_cta_clicked", {
          city_slug: citySlug,
          cta_label: ctaLabel,
        })
      }
    >
      {children}
    </Link>
  );
}
