"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GROUP_DETAIL_RE = /^\/wow\/groups\/([^/]+)$/;

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
    const match = pathname.match(GROUP_DETAIL_RE);
    const currentGroup = match?.[1] ?? null;
    const prev = prevGroupRef.current;

    if (prev && prev !== currentGroup) {
      postRevoke(prev);
    }
    prevGroupRef.current = currentGroup;
  }, [pathname]);

  return null;
}
