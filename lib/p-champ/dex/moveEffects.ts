export const MOVE_EFFECTS = {
  poison: "poison",
  burn: "burn",
  sleep: "sleep",
};

export type MoveEffect = (typeof MOVE_EFFECTS)[keyof typeof MOVE_EFFECTS];

export type MoveEffectRecord = {
  label: string;
  description?: string;
  magnitude?: number;
  duration?: number;
};

export const moveEffectObject = {
  [MOVE_EFFECTS.poison]: {
    label: "Poison",
  },
  [MOVE_EFFECTS.burn]: {
    label: "Burn",
  },
  [MOVE_EFFECTS.sleep]: {
    label: "Sleep",
  },
} as const satisfies Record<MoveEffect, MoveEffectRecord>;
