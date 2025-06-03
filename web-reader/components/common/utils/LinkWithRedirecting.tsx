"use client";

import { Link as HeroLink } from "@heroui/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LinkWithRedirecting({ isExternal, href, ...props }: any) {
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const handleClick = (e: any) => {
    if (!isExternal && typeof href === "string") {
      e.preventDefault();
      router.push("/loading");
      startTransition(() => {
        setTimeout(() => router.push(href), 80);
      });
    }
  };

  return <HeroLink {...props} href={href} onClick={handleClick} />;
}
