import { FORM_IDS } from "./constants";
import type { FormId } from "./constants";
import type { DexForm, DexRecord } from "./dexObject";

function capitalizeWord(word: string): string {
  if (word.length <= 1) return word.toUpperCase();
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Human-readable label for a dex tile (species + form), e.g. "Mega Charizard X",
 * "Alolan Raichu", "Heat Rotom".
 */
export function formatDexTileDisplayName(dexName: string, formId: FormId): string {
  if (formId === FORM_IDS.base) return dexName;

  const regional: Partial<Record<FormId, string>> = {
    [FORM_IDS.aloan]: `Alolan ${dexName}`,
    [FORM_IDS.galarian]: `Galarian ${dexName}`,
    [FORM_IDS.hisuian]: `Hisuian ${dexName}`,
    [FORM_IDS.paldeanCombat]: `Paldean Combat ${dexName}`,
    [FORM_IDS.paldeanFire]: `Paldean Fire ${dexName}`,
    [FORM_IDS.paldeanWater]: `Paldean Water ${dexName}`,
    [FORM_IDS.heat]: `Heat ${dexName}`,
    [FORM_IDS.wash]: `Wash ${dexName}`,
    [FORM_IDS.frost]: `Frost ${dexName}`,
    [FORM_IDS.fan]: `Fan ${dexName}`,
    [FORM_IDS.grass]: `Mow ${dexName}`,
    [FORM_IDS.female]: `Female ${dexName}`,
    [FORM_IDS.small]: `Small ${dexName}`,
    [FORM_IDS.medium]: `Average ${dexName}`,
    [FORM_IDS.large]: `Large ${dexName}`,
    [FORM_IDS.jumbo]: `Super ${dexName}`,
    [FORM_IDS.midnight]: `Midnight ${dexName}`,
    [FORM_IDS.dusk]: `Dusk ${dexName}`,
  };
  const regionalLabel = regional[formId];
  if (regionalLabel !== undefined) return regionalLabel;

  if (!formId.startsWith("form-")) {
    return dexName;
  }

  const slug = formId.slice("form-".length);

  if (slug.startsWith("mega-")) {
    const rest = slug.slice("mega-".length);
    const parts = rest.split("-").filter(Boolean);
    if (parts.length >= 2) {
      const last = parts[parts.length - 1]!.toLowerCase();
      if (last === "x" || last === "y") {
        const species = parts
          .slice(0, -1)
          .map(capitalizeWord)
          .join(" ");
        return `Mega ${species} ${last.toUpperCase()}`;
      }
    }
    return `Mega ${parts.map(capitalizeWord).join(" ")}`;
  }

  if (slug.startsWith("primal-")) {
    const species = slug
      .slice("primal-".length)
      .split("-")
      .map(capitalizeWord)
      .join(" ");
    return `Primal ${species}`;
  }

  if (slug.startsWith("partner-")) {
    return `Partner ${dexName}`;
  }

  if (slug.startsWith("paldean-")) {
    const tail = slug.slice("paldean-".length);
    return `Paldean ${tail.split("-").map(capitalizeWord).join(" ")}`;
  }

  if (slug === "sunny-form" || slug === "rainy-form" || slug === "snowy-form") {
    const w = slug === "sunny-form" ? "Sunny" : slug === "rainy-form" ? "Rainy" : "Snowy";
    return `${w} ${dexName}`;
  }

  const humanized = slug
    .split("-")
    .map((w) => {
      if (w === "forme") return "Forme";
      if (w === "form") return "Form";
      return capitalizeWord(w);
    })
    .join(" ");

  return `${humanized} ${dexName}`;
}

export type DexDisplayEntry = {
  /** Unique key used for rendering and future routing. */
  key: string;
  dexNumber: number;
  dexName: string;
  formId: FormId;
  form?: DexForm;
};

function getFormOrderKey(formId: string): number {
  const ordered = [
    FORM_IDS.base,
    FORM_IDS.aloan,
    FORM_IDS.galarian,
    FORM_IDS.hisuian,
    FORM_IDS.paldeanCombat,
    FORM_IDS.paldeanFire,
    FORM_IDS.paldeanWater,
    FORM_IDS.heat,
    FORM_IDS.wash,
    FORM_IDS.frost,
    FORM_IDS.fan,
    FORM_IDS.grass,
    FORM_IDS.female,
    FORM_IDS.small,
    FORM_IDS.medium,
    FORM_IDS.large,
    FORM_IDS.jumbo,
    FORM_IDS.midnight,
    FORM_IDS.dusk,
  ];
  const idx = ordered.indexOf(formId as (typeof ordered)[number]);
  if (idx !== -1) return idx;
  if (formId.startsWith("form-")) {
    let h = 0;
    for (let i = 0; i < formId.length; i++)
      h = (h * 31 + formId.charCodeAt(i)) >>> 0;
    return 1000 + (h % 100000);
  }
  return Number.MAX_SAFE_INTEGER;
}

export function expandDexRecords(records: DexRecord[]): DexDisplayEntry[] {
  return records.flatMap((r) => {
    const forms = r.forms ?? {};
    const base = forms[FORM_IDS.base];

    const otherFormIds = Object.keys(forms)
      .filter((id): id is FormId => id !== FORM_IDS.base)
      .sort((a, b) => {
        const d = getFormOrderKey(a) - getFormOrderKey(b);
        return d !== 0 ? d : a.localeCompare(b);
      });

    const nat = r.dexNumber.nat;
    const entries: DexDisplayEntry[] = [
      {
        key: String(nat),
        dexNumber: nat,
        dexName: r.dexName,
        formId: FORM_IDS.base,
        form: base ?? undefined,
      },
    ];

    for (const formId of otherFormIds) {
      const form = forms[formId];
      entries.push({
        key: `${nat}-${formId}`,
        dexNumber: nat,
        dexName: r.dexName,
        formId,
        form: form ?? undefined,
      });
    }

    return entries;
  });
}

