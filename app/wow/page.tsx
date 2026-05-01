import type { Metadata } from "next";

import { WowScreen } from "@/components/wow";
import { PORTAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
    title: {
        absolute: `WoW · ${PORTAL_NAME}`,
    },
};

export const dynamic = "force-dynamic";

export default async function WowPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    return <WowScreen searchParams={searchParams} />;
}
