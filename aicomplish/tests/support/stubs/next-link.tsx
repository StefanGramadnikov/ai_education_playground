/**
 * Test stand-in for `next/link` (aliased in cypress.config.ts).
 * Renders a plain anchor so tests can assert `href`s without a Next router,
 * prefetching or client navigation.
 */
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string };
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  children?: ReactNode;
};

export default function Link({ href, children, ...props }: Props) {
  // Drop next/link-only props so they don't reach the DOM.
  const { prefetch, replace, scroll, ...rest } = props;
  void [prefetch, replace, scroll];
  return (
    <a href={typeof href === "string" ? href : (href.pathname ?? "")} {...rest}>
      {children}
    </a>
  );
}
