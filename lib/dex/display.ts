import { FORM_IDS } from "./constants";
import type { FormId } from "./constants";
import type { DexForm, DexRecord } from "./dexObject";

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
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

export function expandDexRecords(records: DexRecord[]): DexDisplayEntry[] {
  return records.flatMap((r) => {
    const forms = r.forms ?? {};
    const base = forms[FORM_IDS.base];

    const otherFormIds = Object.keys(forms)
      .filter((id): id is FormId => id !== FORM_IDS.base)
      .sort((a, b) => getFormOrderKey(a) - getFormOrderKey(b));

    const entries: DexDisplayEntry[] = [
      {
        key: String(r.dexNumber),
        dexNumber: r.dexNumber,
        dexName: r.dexName,
        formId: FORM_IDS.base,
        form: base ?? undefined,
      },
    ];

    for (const formId of otherFormIds) {
      const form = forms[formId];
      entries.push({
        key: `${r.dexNumber}-${formId}`,
        dexNumber: r.dexNumber,
        dexName: r.dexName,
        formId,
        form: form ?? undefined,
      });
    }

    return entries;
  });
}

