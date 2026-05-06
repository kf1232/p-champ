"use client";

import { useEffect, useId, useMemo, useState } from "react";

import {
  extractProfileClassSpecIds,
  getWowheadBisGearGuideUrl,
  listWowheadBisGearOptionsForClass,
} from "@/lib/wow";

export type CharacterWowheadBisGearSectionProps = {
  profile: unknown;
};

/**
 * Wowhead BiS gear guide link — URL pattern
 * `/guide/classes/{classSlug}/{specSlug}/bis-gear`, spec selectable vs profile active spec.
 */
export function CharacterWowheadBisGearSection({
  profile,
}: CharacterWowheadBisGearSectionProps) {
  const classSpecIds = useMemo(
    () => extractProfileClassSpecIds(profile),
    [profile],
  );

  const bisOptions = useMemo(() => {
    const cid = classSpecIds.classId;
    if (cid == null) return [];
    return listWowheadBisGearOptionsForClass(cid);
  }, [classSpecIds.classId]);

  const [bisSpecId, setBisSpecId] = useState<number | null>(null);
  const bisSpecSelectId = useId();

  useEffect(() => {
    queueMicrotask(() => {
      if (classSpecIds.classId == null || bisOptions.length === 0) {
        setBisSpecId(null);
        return;
      }
      const preferred = classSpecIds.activeSpecId;
      const next =
        preferred != null &&
        bisOptions.some((o) => o.specId === preferred)
          ? preferred
          : bisOptions[0].specId;
      setBisSpecId(next);
    });
  }, [profile, classSpecIds.classId, classSpecIds.activeSpecId, bisOptions]);

  const effectiveBisSpecId =
    bisSpecId ?? (bisOptions.length > 0 ? bisOptions[0].specId : null);

  const bisGuideUrl =
    classSpecIds.classId != null && effectiveBisSpecId != null
      ? getWowheadBisGearGuideUrl(classSpecIds.classId, effectiveBisSpecId)
      : null;

  if (!(bisOptions.length > 0 && bisGuideUrl)) {
    return null;
  }

  return (
    <section
      className="character-overview-segment"
      aria-labelledby="character-overview-bis-heading"
    >
      <div className="character-overview-bis-row">
        <div className="character-form-field character-overview-bis-field">
          <label className="character-label" htmlFor={bisSpecSelectId}>
            Specialization
          </label>
          <select
            id={bisSpecSelectId}
            className="character-select"
            value={bisSpecId ?? bisOptions[0]!.specId}
            onChange={(e) => {
              setBisSpecId(Number(e.target.value));
            }}
          >
            {bisOptions.map((o) => (
              <option key={o.specId} value={o.specId}>
                {o.specName}
              </option>
            ))}
          </select>
        </div>
        <div className="character-overview-bis-actions">
          <a
            className="character-submit-secondary"
            href={bisGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open BiS gear guide
          </a>
        </div>
      </div>
    </section>
  );
}
