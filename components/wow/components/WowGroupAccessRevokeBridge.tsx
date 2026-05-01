"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { WOW_GROUP_DETAIL_PATHNAME_RE } from "@/lib/wow/wowRoutes";

function postRevoke(groupId: string) {
  void fetch("/api/wow/revoke-group-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId }),
    keepalive: true,
  });
}

/**
 * When the user navigates away from a group detail URL (soft or full navigation),
 * revoke that group's grant so the next visit requires the password again.
 */
export function WowGroupAccessRevokeBridge() {
  const pathname = usePathname();
  const prevGroupRef = useRef<string | null>(null);

  useEffect(() => {
    const match = pathname.match(WOW_GROUP_DETAIL_PATHNAME_RE);
    const currentGroup = match?.[1] ?? null;
    const prev = prevGroupRef.current;

    if (prev && prev !== currentGroup) {
      postRevoke(prev);
    }
    prevGroupRef.current = currentGroup;
  }, [pathname]);

  return null;
}
