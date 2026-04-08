/** Canonical type name strings — use these instead of raw `"dragon"` literals. */
export const TYPE_NAMES = {
  dragon: "dragon",
  steel: "steel",
  flying: "flying",
  fairy: "fairy",
  grass: "grass",
  ice: "ice",
  rock: "rock",
  electric: "electric",
  normal: "normal",
  fire: "fire",
  ghost: "ghost",
} as const;

export type TypeName = (typeof TYPE_NAMES)[keyof typeof TYPE_NAMES];


export type TypeModifierTable = Partial<Record<TypeName, number>>;

export type TypeRecord = {
  typeName: TypeName;
  typeAtkModifier: TypeModifierTable;
  typeDefModifier: TypeModifierTable;
};

export const TYPES = {
  dragon: {
    typeName: TYPE_NAMES.dragon,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  steel: {
    typeName: TYPE_NAMES.steel,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  flying: {
    typeName: TYPE_NAMES.flying,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  fairy: {
    typeName: TYPE_NAMES.fairy,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  grass: {
    typeName: TYPE_NAMES.grass,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  ice: {
    typeName: TYPE_NAMES.ice,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  rock: {
    typeName: TYPE_NAMES.rock,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  electric: {
    typeName: TYPE_NAMES.electric,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  normal: {
    typeName: TYPE_NAMES.normal,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  fire: {
    typeName: TYPE_NAMES.fire,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
  ghost: {
    typeName: TYPE_NAMES.ghost,
    typeAtkModifier: {},
    typeDefModifier: {},
  },
} as const satisfies Record<string, TypeRecord>;

export type TypeId = (typeof TYPES)[keyof typeof TYPES];
