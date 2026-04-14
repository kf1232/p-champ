import { FORM_IDS, GAME_IDS } from "./constants";
import type { FormId, GameId } from "./constants";
import { MOVES } from "./moves";
import type { MoveId } from "./moves";
import { TYPES } from "./types";
import type { TypeId } from "./types";

/** One species form: base stats, typings, and learnset. Stats may be {@link DEX_STAT_TODO} placeholders. */
export type DexForm = {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  types: TypeId[];
  moves: MoveId[];
};

/**
 * Sentinel for a single base stat while the full stat row is still unverified.
 * Prefer spreading {@link DEX_FORM_STATS_TODO} in `dexObject` until stats are verified.
 */
export const DEX_STAT_TODO = -1;

/** Base stats row used as a todo placeholder — spread into each `DexForm` until real values exist. */
export const DEX_FORM_STATS_TODO = {
  hp: DEX_STAT_TODO,
  attack: DEX_STAT_TODO,
  defense: DEX_STAT_TODO,
  spAtk: DEX_STAT_TODO,
  spDef: DEX_STAT_TODO,
  speed: DEX_STAT_TODO,
} as const satisfies Pick<
  DexForm,
  "hp" | "attack" | "defense" | "spAtk" | "spDef" | "speed"
>;

export function isDexFormStatsTodo(
  form: Pick<
    DexForm,
    "hp" | "attack" | "defense" | "spAtk" | "spDef" | "speed"
  >,
): boolean {
  return (
    (["hp", "attack", "defense", "spAtk", "spDef", "speed"] as const).every(
      (k) => form[k] === DEX_FORM_STATS_TODO[k],
    )
  );
}

export type DexRecord = {
  dexNumber: { nat: number };
  dexName: string;
  games: Record<GameId, boolean>;
  forms: { base: DexForm | null } & Partial<Record<FormId, DexForm | null>>;
};

export const dexObject: Record<number, DexRecord> = {
  1: {
    dexNumber: { nat: 1 },
    dexName: "Bulbasaur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  2: {
    dexNumber: { nat: 2 },
    dexName: "Ivysaur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  3: {
    dexNumber: { nat: 3 },
    dexName: "Venusaur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
      "form-mega-venusaur": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  4: {
    dexNumber: { nat: 4 },
    dexName: "Charmander",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  5: {
    dexNumber: { nat: 5 },
    dexName: "Charmeleon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  6: {
    dexNumber: { nat: 6 },
    dexName: "Charizard",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
      "form-mega-charizard-x": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.dragon], moves: [] },
      "form-mega-charizard-y": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
    },
  },
  7: {
    dexNumber: { nat: 7 },
    dexName: "Squirtle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  8: {
    dexNumber: { nat: 8 },
    dexName: "Wartortle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  9: {
    dexNumber: { nat: 9 },
    dexName: "Blastoise",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      "form-mega-blastoise": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  10: {
    dexNumber: { nat: 10 },
    dexName: "Caterpie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  11: {
    dexNumber: { nat: 11 },
    dexName: "Metapod",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  12: {
    dexNumber: { nat: 12 },
    dexName: "Butterfree",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  13: {
    dexNumber: { nat: 13 },
    dexName: "Weedle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  14: {
    dexNumber: { nat: 14 },
    dexName: "Kakuna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  15: {
    dexNumber: { nat: 15 },
    dexName: "Beedrill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
      "form-mega-beedrill": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  16: {
    dexNumber: { nat: 16 },
    dexName: "Pidgey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  17: {
    dexNumber: { nat: 17 },
    dexName: "Pidgeotto",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  18: {
    dexNumber: { nat: 18 },
    dexName: "Pidgeot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      "form-mega-pidgeot": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  19: {
    dexNumber: { nat: 19 },
    dexName: "Rattata",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.normal], moves: [] },
    },
  },
  20: {
    dexNumber: { nat: 20 },
    dexName: "Raticate",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.normal], moves: [] },
    },
  },
  21: {
    dexNumber: { nat: 21 },
    dexName: "Spearow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  22: {
    dexNumber: { nat: 22 },
    dexName: "Fearow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  23: {
    dexNumber: { nat: 23 },
    dexName: "Ekans",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  24: {
    dexNumber: { nat: 24 },
    dexName: "Arbok",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  25: {
    dexNumber: { nat: 25 },
    dexName: "Pikachu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
      "form-partner-pikachu": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  26: {
    dexNumber: { nat: 26 },
    dexName: "Raichu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.psychic], moves: [] },
    },
  },
  27: {
    dexNumber: { nat: 27 },
    dexName: "Sandshrew",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.steel], moves: [] },
    },
  },
  28: {
    dexNumber: { nat: 28 },
    dexName: "Sandslash",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.steel], moves: [] },
    },
  },
  29: {
    dexNumber: { nat: 29 },
    dexName: "Nidoran♀",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  30: {
    dexNumber: { nat: 30 },
    dexName: "Nidorina",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  31: {
    dexNumber: { nat: 31 },
    dexName: "Nidoqueen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.ground], moves: [] },
    },
  },
  32: {
    dexNumber: { nat: 32 },
    dexName: "Nidoran♂",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  33: {
    dexNumber: { nat: 33 },
    dexName: "Nidorino",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  34: {
    dexNumber: { nat: 34 },
    dexName: "Nidoking",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.ground], moves: [] },
    },
  },
  35: {
    dexNumber: { nat: 35 },
    dexName: "Clefairy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  36: {
    dexNumber: { nat: 36 },
    dexName: "Clefable",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  37: {
    dexNumber: { nat: 37 },
    dexName: "Vulpix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  38: {
    dexNumber: { nat: 38 },
    dexName: "Ninetales",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.fairy], moves: [] },
    },
  },
  39: {
    dexNumber: { nat: 39 },
    dexName: "Jigglypuff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fairy], moves: [] },
    },
  },
  40: {
    dexNumber: { nat: 40 },
    dexName: "Wigglytuff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fairy], moves: [] },
    },
  },
  41: {
    dexNumber: { nat: 41 },
    dexName: "Zubat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.flying], moves: [] },
    },
  },
  42: {
    dexNumber: { nat: 42 },
    dexName: "Golbat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.flying], moves: [] },
    },
  },
  43: {
    dexNumber: { nat: 43 },
    dexName: "Oddish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  44: {
    dexNumber: { nat: 44 },
    dexName: "Gloom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  45: {
    dexNumber: { nat: 45 },
    dexName: "Vileplume",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  46: {
    dexNumber: { nat: 46 },
    dexName: "Paras",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
    },
  },
  47: {
    dexNumber: { nat: 47 },
    dexName: "Parasect",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
    },
  },
  48: {
    dexNumber: { nat: 48 },
    dexName: "Venonat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  49: {
    dexNumber: { nat: 49 },
    dexName: "Venomoth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  50: {
    dexNumber: { nat: 50 },
    dexName: "Diglett",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.steel], moves: [] },
    },
  },
  51: {
    dexNumber: { nat: 51 },
    dexName: "Dugtrio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.steel], moves: [] },
    },
  },
  52: {
    dexNumber: { nat: 52 },
    dexName: "Meowth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  53: {
    dexNumber: { nat: 53 },
    dexName: "Persian",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  54: {
    dexNumber: { nat: 54 },
    dexName: "Psyduck",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  55: {
    dexNumber: { nat: 55 },
    dexName: "Golduck",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  56: {
    dexNumber: { nat: 56 },
    dexName: "Mankey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  57: {
    dexNumber: { nat: 57 },
    dexName: "Primeape",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  58: {
    dexNumber: { nat: 58 },
    dexName: "Growlithe",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.rock], moves: [] },
    },
  },
  59: {
    dexNumber: { nat: 59 },
    dexName: "Arcanine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 165,
        attack: 130,
        defense: 100,
        spAtk: 120,
        spDef: 100,
        speed: 115,
        types: [TYPES.fire],
        moves: [
          MOVES.gigaImpact,
          MOVES.doubleEdge,
          MOVES.thrash,
          MOVES.bodySlam,
          MOVES.extremeSpeed,
          MOVES.facade,
          MOVES.covet,
          MOVES.hyperBeam,
          MOVES.hyperVoice,
          MOVES.round,
          MOVES.snore,
          MOVES.howl,
          MOVES.helpingHand,
          MOVES.morningSun,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.scaryFace,
          MOVES.protect,
          MOVES.substitue,
          MOVES.roar,
          MOVES.solarBeam,
          MOVES.ragingFury,
          MOVES.flareBlitz,
          MOVES.temperFlare,
          MOVES.fireFang,
          MOVES.flameCharge,
          MOVES.heatCrash,
          MOVES.burnUp,
          MOVES.overheat,
          MOVES.fireBlast,
          MOVES.heatWave,
          MOVES.flamethrower,
          MOVES.fireSpin,
          MOVES.willOWisp,
          MOVES.sunnyDay,
          MOVES.wildCharge,
          MOVES.thunderFang,
          MOVES.aerialAce,
          MOVES.dig,
          MOVES.bulldoze,
          MOVES.scorchingSands,
          MOVES.closeCombat,
          MOVES.reversal,
          MOVES.psychicFangs,
          MOVES.rest,
          MOVES.agility,
          MOVES.curse,
          MOVES.outrage,
          MOVES.dragonPulse,
          MOVES.crunch,
          MOVES.thief,
          MOVES.bite,
          MOVES.snarl,
          MOVES.ironTail,
          MOVES.ironHead,
          MOVES.playRough,
          MOVES.charm,
        ],
      },
      [FORM_IDS.hisuian]: {
        hp: 170,
        attack: 135,
        defense: 100,
        spAtk: 115,
        spDef: 100,
        speed: 110,
        types: [TYPES.fire, TYPES.rock],
        moves: []
      },
    },
  },
  60: {
    dexNumber: { nat: 60 },
    dexName: "Poliwag",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  61: {
    dexNumber: { nat: 61 },
    dexName: "Poliwhirl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  62: {
    dexNumber: { nat: 62 },
    dexName: "Poliwrath",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fighting], moves: [] },
    },
  },
  63: {
    dexNumber: { nat: 63 },
    dexName: "Abra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  64: {
    dexNumber: { nat: 64 },
    dexName: "Kadabra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  65: {
    dexNumber: { nat: 65 },
    dexName: "Alakazam",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-mega-alakazam": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  66: {
    dexNumber: { nat: 66 },
    dexName: "Machop",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  67: {
    dexNumber: { nat: 67 },
    dexName: "Machoke",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  68: {
    dexNumber: { nat: 68 },
    dexName: "Machamp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  69: {
    dexNumber: { nat: 69 },
    dexName: "Bellsprout",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  70: {
    dexNumber: { nat: 70 },
    dexName: "Weepinbell",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  71: {
    dexNumber: { nat: 71 },
    dexName: "Victreebel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
      "form-mega-victreebel": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  72: {
    dexNumber: { nat: 72 },
    dexName: "Tentacool",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.poison], moves: [] },
    },
  },
  73: {
    dexNumber: { nat: 73 },
    dexName: "Tentacruel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.poison], moves: [] },
    },
  },
  74: {
    dexNumber: { nat: 74 },
    dexName: "Geodude",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.electric], moves: [] },
    },
  },
  75: {
    dexNumber: { nat: 75 },
    dexName: "Graveler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.electric], moves: [] },
    },
  },
  76: {
    dexNumber: { nat: 76 },
    dexName: "Golem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.electric], moves: [] },
    },
  },
  77: {
    dexNumber: { nat: 77 },
    dexName: "Ponyta",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  78: {
    dexNumber: { nat: 78 },
    dexName: "Rapidash",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  79: {
    dexNumber: { nat: 79 },
    dexName: "Slowpoke",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  80: {
    dexNumber: { nat: 80 },
    dexName: "Slowbro",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
      "form-mega-slowbro": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.psychic], moves: [] },
    },
  },
  81: {
    dexNumber: { nat: 81 },
    dexName: "Magnemite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.steel], moves: [] },
    },
  },
  82: {
    dexNumber: { nat: 82 },
    dexName: "Magneton",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.steel], moves: [] },
    },
  },
  83: {
    dexNumber: { nat: 83 },
    dexName: "Farfetch'd",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  84: {
    dexNumber: { nat: 84 },
    dexName: "Doduo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  85: {
    dexNumber: { nat: 85 },
    dexName: "Dodrio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  86: {
    dexNumber: { nat: 86 },
    dexName: "Seel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  87: {
    dexNumber: { nat: 87 },
    dexName: "Dewgong",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ice], moves: [] },
    },
  },
  88: {
    dexNumber: { nat: 88 },
    dexName: "Grimer",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dark], moves: [] },
    },
  },
  89: {
    dexNumber: { nat: 89 },
    dexName: "Muk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dark], moves: [] },
    },
  },
  90: {
    dexNumber: { nat: 90 },
    dexName: "Shellder",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  91: {
    dexNumber: { nat: 91 },
    dexName: "Cloyster",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ice], moves: [] },
    },
  },
  92: {
    dexNumber: { nat: 92 },
    dexName: "Gastly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.poison], moves: [] },
    },
  },
  93: {
    dexNumber: { nat: 93 },
    dexName: "Haunter",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.poison], moves: [] },
    },
  },
  94: {
    dexNumber: { nat: 94 },
    dexName: "Gengar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 135,
        attack: 85,
        defense: 80,
        spAtk: 150,
        spDef: 95,
        speed: 130,
        types: [TYPES.ghost, TYPES.poison],
        moves: [
          MOVES.selfDestruct,
          MOVES.gigaImpact,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.hyperBeam,
          MOVES.round,
          MOVES.snore,
          MOVES.reflectType,
          MOVES.psychUp,
          MOVES.painSplit,
          MOVES.sleepTalk,
          MOVES.meanLook,
          MOVES.endure,
          MOVES.perishSong,
          MOVES.scaryFace,
          MOVES.protect,
          MOVES.substitue,
          MOVES.disable,
          MOVES.energyBall,
          MOVES.gigaDrain,
          MOVES.firePunch,
          MOVES.willOWisp,
          MOVES.sunnyDay,
          MOVES.rainDance,
          MOVES.thunderPunch,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.thunderWave,
          MOVES.skitterSmack,
          MOVES.gunkShot,
          MOVES.poisonJab,
          MOVES.sludgeWave,
          MOVES.sludgeBomb,
          MOVES.venoshock,
          MOVES.clearSmog,
          MOVES.acidSpray,
          MOVES.corrosiveGas,
          MOVES.toxicSpikes,
          MOVES.toxic,
          MOVES.icePunch,
          MOVES.icyWind,
          MOVES.haze,
          MOVES.focusPunch,
          MOVES.drainPunch,
          MOVES.brickBreak,
          MOVES.focusBlast,
          MOVES.psychic,
          MOVES.psychicNoise,
          MOVES.wonderRoom,
          MOVES.trickRoom,
          MOVES.imprison,
          MOVES.skillSwap,
          MOVES.trick,
          MOVES.rest,
          MOVES.hypnosis,
          MOVES.poltergeist,
          MOVES.phantomForce,
          MOVES.shadowClaw,
          MOVES.shadowPunch,
          MOVES.shadowBall,
          MOVES.hex,
          MOVES.nightShade,
          MOVES.destinyBond,
          MOVES.spite,
          MOVES.curse,
          MOVES.confuseRay,
          MOVES.foulPlay,
          MOVES.suckerPunch,
          MOVES.knockOff,
          MOVES.thief,
          MOVES.payback,
          MOVES.fling,
          MOVES.darkPulse,
          MOVES.nastyPlot,
          MOVES.taunt,
          MOVES.dazzlingGleam,
        ]
      }
    },
  },
  95: {
    dexNumber: { nat: 95 },
    dexName: "Onix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
    },
  },
  96: {
    dexNumber: { nat: 96 },
    dexName: "Drowzee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  97: {
    dexNumber: { nat: 97 },
    dexName: "Hypno",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  98: {
    dexNumber: { nat: 98 },
    dexName: "Krabby",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  99: {
    dexNumber: { nat: 99 },
    dexName: "Kingler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  100: {
    dexNumber: { nat: 100 },
    dexName: "Voltorb",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.grass], moves: [] },
    },
  },
  101: {
    dexNumber: { nat: 101 },
    dexName: "Electrode",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.grass], moves: [] },
    },
  },
  102: {
    dexNumber: { nat: 102 },
    dexName: "Exeggcute",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.psychic], moves: [] },
    },
  },
  103: {
    dexNumber: { nat: 103 },
    dexName: "Exeggutor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.psychic], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  104: {
    dexNumber: { nat: 104 },
    dexName: "Cubone",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  105: {
    dexNumber: { nat: 105 },
    dexName: "Marowak",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      [FORM_IDS.aloan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ghost], moves: [] },
    },
  },
  106: {
    dexNumber: { nat: 106 },
    dexName: "Hitmonlee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  107: {
    dexNumber: { nat: 107 },
    dexName: "Hitmonchan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  108: {
    dexNumber: { nat: 108 },
    dexName: "Lickitung",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  109: {
    dexNumber: { nat: 109 },
    dexName: "Koffing",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  110: {
    dexNumber: { nat: 110 },
    dexName: "Weezing",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fairy], moves: [] },
    },
  },
  111: {
    dexNumber: { nat: 111 },
    dexName: "Rhyhorn",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.rock], moves: [] },
    },
  },
  112: {
    dexNumber: { nat: 112 },
    dexName: "Rhydon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.rock], moves: [] },
    },
  },
  113: {
    dexNumber: { nat: 113 },
    dexName: "Chansey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  114: {
    dexNumber: { nat: 114 },
    dexName: "Tangela",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  115: {
    dexNumber: { nat: 115 },
    dexName: "Kangaskhan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 180,
        attack: 115,
        defense: 100,
        spAtk: 60,
        spDef: 100,
        speed: 110,
        types: [TYPES.normal],
        moves: [
          MOVES.gigaImpact,
          MOVES.lastResort,
          MOVES.doubleEdge,
          MOVES.megaKick,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.fakeOut,
          MOVES.doubleHit,
          MOVES.endeavor,
          MOVES.hyperBeam,
          MOVES.uproar,
          MOVES.round,
          MOVES.terrainPulse,
          MOVES.snore,
          MOVES.helpingHand,
          MOVES.safeGuard,
          MOVES.sleepTalk,
          MOVES.attract,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.focusEnergy,
          MOVES.disable,
          MOVES.solarBeam,
          MOVES.firePunch,
          MOVES.fireBlast,
          MOVES.flamethrower,
          MOVES.sunnyDay,
          MOVES.hydroPump,
          MOVES.surf,
          MOVES.whirlpool,
          MOVES.rainDance,
          MOVES.thunderPunch,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.rockSlide,
          MOVES.rockTomb,
          MOVES.sandstorm,
          MOVES.earthquake,
          MOVES.dig,
          MOVES.bulldoze,
          MOVES.icePunch,
          MOVES.avalanche,
          MOVES.blizzard,
          MOVES.iceBeam,
          MOVES.icyWind,
          MOVES.hammerArm,
          MOVES.dynamicPunch,
          MOVES.drainPunch,
          MOVES.brickBreak,
          MOVES.circleThrow,
          MOVES.reversal,
          MOVES.counter,
          MOVES.lowKick,
          MOVES.focusBlast,
          MOVES.rest,
          MOVES.shadowClaw,
          MOVES.shadowBall,
          MOVES.outrage,
          MOVES.crunch,
          MOVES.suckerPunch,
          MOVES.assurance,
          MOVES.thief,
          MOVES.bite,
          MOVES.fling,
          MOVES.beatUp,
          MOVES.ironTail,
        ],
      }
    },
  },
  116: {
    dexNumber: { nat: 116 },
    dexName: "Horsea",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  117: {
    dexNumber: { nat: 117 },
    dexName: "Seadra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  118: {
    dexNumber: { nat: 118 },
    dexName: "Goldeen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  119: {
    dexNumber: { nat: 119 },
    dexName: "Seaking",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  120: {
    dexNumber: { nat: 120 },
    dexName: "Staryu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  121: {
    dexNumber: { nat: 121 },
    dexName: "Starmie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
    },
  },
  122: {
    dexNumber: { nat: 122 },
    dexName: "Mr. Mime",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.psychic], moves: [] },
    },
  },
  123: {
    dexNumber: { nat: 123 },
    dexName: "Scyther",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  124: {
    dexNumber: { nat: 124 },
    dexName: "Jynx",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.psychic], moves: [] },
    },
  },
  125: {
    dexNumber: { nat: 125 },
    dexName: "Electabuzz",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  126: {
    dexNumber: { nat: 126 },
    dexName: "Magmar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  127: {
    dexNumber: { nat: 127 },
    dexName: "Pinsir",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
      "form-mega-pinsir": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  128: {
    dexNumber: { nat: 128 },
    dexName: "Tauros",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.paldeanCombat]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
      [FORM_IDS.paldeanFire]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.fire], moves: [] },
      [FORM_IDS.paldeanWater]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.water], moves: [] },
    },
  },
  129: {
    dexNumber: { nat: 129 },
    dexName: "Magikarp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  130: {
    dexNumber: { nat: 130 },
    dexName: "Gyarados",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
      "form-mega-gyarados": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  131: {
    dexNumber: { nat: 131 },
    dexName: "Lapras",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ice], moves: [] },
    },
  },
  132: {
    dexNumber: { nat: 132 },
    dexName: "Ditto",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  133: {
    dexNumber: { nat: 133 },
    dexName: "Eevee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-partner-eevee": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  134: {
    dexNumber: { nat: 134 },
    dexName: "Vaporeon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  135: {
    dexNumber: { nat: 135 },
    dexName: "Jolteon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  136: {
    dexNumber: { nat: 136 },
    dexName: "Flareon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  137: {
    dexNumber: { nat: 137 },
    dexName: "Porygon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  138: {
    dexNumber: { nat: 138 },
    dexName: "Omanyte",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  139: {
    dexNumber: { nat: 139 },
    dexName: "Omastar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  140: {
    dexNumber: { nat: 140 },
    dexName: "Kabuto",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  141: {
    dexNumber: { nat: 141 },
    dexName: "Kabutops",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  142: {
    dexNumber: { nat: 142 },
    dexName: "Aerodactyl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
      "form-mega-aerodactyl": { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
    },
  },
  143: {
    dexNumber: { nat: 143 },
    dexName: "Snorlax",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  144: {
    dexNumber: { nat: 144 },
    dexName: "Articuno",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.flying], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  145: {
    dexNumber: { nat: 145 },
    dexName: "Zapdos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.flying], moves: [] },
    },
  },
  146: {
    dexNumber: { nat: 146 },
    dexName: "Moltres",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  147: {
    dexNumber: { nat: 147 },
    dexName: "Dratini",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  148: {
    dexNumber: { nat: 148 },
    dexName: "Dragonair",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  149: {
    dexNumber: { nat: 149 },
    dexName: "Dragonite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 166,
        attack: 154,
        defense: 115,
        spAtk: 120,
        spDef: 120,
        speed: 100,
        types: [TYPES.dragon, TYPES.flying],
        moves: [
          MOVES.gigaImpact,
          MOVES.megaKick,
          MOVES.bodySlam,
          MOVES.extremeSpeed,
          MOVES.facade,
          MOVES.wrap,
          MOVES.hyperBeam,
          MOVES.round,
          MOVES.weatherBall,
          MOVES.snore,
          MOVES.helpingHand,
          MOVES.safeGuard,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.scaryFace,
          MOVES.protect,
          MOVES.substitue,
          MOVES.roar,
          MOVES.whirlwind,
          MOVES.firePunch,
          MOVES.fireBlast,
          MOVES.heatWave,
          MOVES.flamethrower,
          MOVES.fireSpin,
          MOVES.sunnyDay,
          MOVES.aquaTail,
          MOVES.dive,
          MOVES.waterfall,
          MOVES.aquaJet,
          MOVES.hydroPump,
          MOVES.surf,
          MOVES.waterPulse,
          MOVES.chillingWater,
          MOVES.rainDance,
          MOVES.thunderPunch,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.thunderWave,
          MOVES.fly,
          MOVES.aerialAce,
          MOVES.hurricane,
          MOVES.airSlash,
          MOVES.airCutter,
          MOVES.tailwind,
          MOVES.roost,
          MOVES.stoneEdge,
          MOVES.rockSlide,
          MOVES.rockTomb,
          MOVES.sandstorm,
          MOVES.earthquake,
          MOVES.stompingTantrum,
          MOVES.bulldoze,
          MOVES.iceSpinner,
          MOVES.icePunch,
          MOVES.blizzard,
          MOVES.iceBeam,
          MOVES.icyWind,
          MOVES.snowscape,
          MOVES.haze,
          MOVES.focusPunch,
          MOVES.superPower,
          MOVES.bodyPress,
          MOVES.brickBreak,
          MOVES.lowKick,
          MOVES.focusBlast,
          MOVES.rest,
          MOVES.lightScreen,
          MOVES.agility,
          MOVES.outrage,
          MOVES.dragonRush,
          MOVES.dragonClaw,
          MOVES.breakingSwipe,
          MOVES.dragonTail,
          MOVES.scaleShot,
          MOVES.dracoMeteor,
          MOVES.dragonPulse,
          MOVES.dragonCheer,
          MOVES.dragonDance,
          MOVES.brutalSwing,
          MOVES.fling,
          MOVES.ironTail,
          MOVES.ironHead,
          MOVES.steelWing,
        ],
      }
    },
  },
  150: {
    dexNumber: { nat: 150 },
    dexName: "Mewtwo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-mega-mewtwo-x": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fighting], moves: [] },
      "form-mega-mewtwo-y": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  151: {
    dexNumber: { nat: 151 },
    dexName: "Mew",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  152: {
    dexNumber: { nat: 152 },
    dexName: "Chikorita",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  153: {
    dexNumber: { nat: 153 },
    dexName: "Bayleef",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  154: {
    dexNumber: { nat: 154 },
    dexName: "Meganium",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  155: {
    dexNumber: { nat: 155 },
    dexName: "Cyndaquil",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  156: {
    dexNumber: { nat: 156 },
    dexName: "Quilava",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  157: {
    dexNumber: { nat: 157 },
    dexName: "Typhlosion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ghost], moves: [] },
    },
  },
  158: {
    dexNumber: { nat: 158 },
    dexName: "Totodile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  159: {
    dexNumber: { nat: 159 },
    dexName: "Croconaw",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  160: {
    dexNumber: { nat: 160 },
    dexName: "Feraligatr",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  161: {
    dexNumber: { nat: 161 },
    dexName: "Sentret",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  162: {
    dexNumber: { nat: 162 },
    dexName: "Furret",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  163: {
    dexNumber: { nat: 163 },
    dexName: "Hoothoot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  164: {
    dexNumber: { nat: 164 },
    dexName: "Noctowl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  165: {
    dexNumber: { nat: 165 },
    dexName: "Ledyba",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  166: {
    dexNumber: { nat: 166 },
    dexName: "Ledian",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  167: {
    dexNumber: { nat: 167 },
    dexName: "Spinarak",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  168: {
    dexNumber: { nat: 168 },
    dexName: "Ariados",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  169: {
    dexNumber: { nat: 169 },
    dexName: "Crobat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.flying], moves: [] },
    },
  },
  170: {
    dexNumber: { nat: 170 },
    dexName: "Chinchou",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.electric], moves: [] },
    },
  },
  171: {
    dexNumber: { nat: 171 },
    dexName: "Lanturn",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.electric], moves: [] },
    },
  },
  172: {
    dexNumber: { nat: 172 },
    dexName: "Pichu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  173: {
    dexNumber: { nat: 173 },
    dexName: "Cleffa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  174: {
    dexNumber: { nat: 174 },
    dexName: "Igglybuff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fairy], moves: [] },
    },
  },
  175: {
    dexNumber: { nat: 175 },
    dexName: "Togepi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  176: {
    dexNumber: { nat: 176 },
    dexName: "Togetic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.flying], moves: [] },
    },
  },
  177: {
    dexNumber: { nat: 177 },
    dexName: "Natu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  178: {
    dexNumber: { nat: 178 },
    dexName: "Xatu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  179: {
    dexNumber: { nat: 179 },
    dexName: "Mareep",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  180: {
    dexNumber: { nat: 180 },
    dexName: "Flaaffy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  181: {
    dexNumber: { nat: 181 },
    dexName: "Ampharos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 165,
        attack: 95,
        defense: 105,
        spAtk: 135,
        spDef: 110,
        speed: 75,
        types: [TYPES.electric],
        moves: [
          MOVES.gigaImpact,
          MOVES.doubleEdge,
          MOVES.megaKick,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.endeavor,
          MOVES.hyperBeam,
          MOVES.round,
          MOVES.snore,
          MOVES.afterYou,
          MOVES.helpingHand,
          MOVES.safeguard,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.screech,
          MOVES.roar,
          MOVES.trailblaze,
          MOVES.cottonGuard,
          MOVES.cottonSpore,
          MOVES.firePunch,
          MOVES.sunnyDay,
          MOVES.rainDance,
          MOVES.supercellSlam,
          MOVES.wildCharge,
          MOVES.thunderPunch,
          MOVES.zapCannon,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.discharge,
          MOVES.risingVoltage,
          MOVES.voltSwitch,
          MOVES.parabolicCharge,
          MOVES.electroweb,
          MOVES.chargeBeam,
          MOVES.electroBall,
          MOVES.electricTerrain,
          MOVES.magneticFlux,
          MOVES.eerieImpulse,
          MOVES.charge,
          MOVES.thunderWave,
          MOVES.meteorBeam,
          MOVES.powerGem,
          MOVES.dig,
          MOVES.stompingTantrum,
          MOVES.bulldoze,
          MOVES.icePunch,
          MOVES.focusPunch,
          MOVES.brickBreak,
          MOVES.lowKick,
          MOVES.focusBlast,
          MOVES.rest,
          MOVES.reflect,
          MOVES.lightScreen,
          MOVES.agility,
          MOVES.confuseRay,
          MOVES.outrage,
          MOVES.breakingSwipe,
          MOVES.dragonTail,
          MOVES.dragonPulse,
          MOVES.dragonCheer,
          MOVES.brutalSwing,
          MOVES.fling,
          MOVES.flatter,
          MOVES.ironTail,
          MOVES.dazzlingGleam,
        ],
      }
    },
  },
  182: {
    dexNumber: { nat: 182 },
    dexName: "Bellossom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  183: {
    dexNumber: { nat: 183 },
    dexName: "Marill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fairy], moves: [] },
    },
  },
  184: {
    dexNumber: { nat: 184 },
    dexName: "Azumarill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fairy], moves: [] },
    },
  },
  185: {
    dexNumber: { nat: 185 },
    dexName: "Sudowoodo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  186: {
    dexNumber: { nat: 186 },
    dexName: "Politoed",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  187: {
    dexNumber: { nat: 187 },
    dexName: "Hoppip",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  188: {
    dexNumber: { nat: 188 },
    dexName: "Skiploom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  189: {
    dexNumber: { nat: 189 },
    dexName: "Jumpluff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  190: {
    dexNumber: { nat: 190 },
    dexName: "Aipom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  191: {
    dexNumber: { nat: 191 },
    dexName: "Sunkern",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  192: {
    dexNumber: { nat: 192 },
    dexName: "Sunflora",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  193: {
    dexNumber: { nat: 193 },
    dexName: "Yanma",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  194: {
    dexNumber: { nat: 194 },
    dexName: "Wooper",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
      "form-paldean-wooper": { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.ground], moves: [] },
    },
  },
  195: {
    dexNumber: { nat: 195 },
    dexName: "Quagsire",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  196: {
    dexNumber: { nat: 196 },
    dexName: "Espeon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  197: {
    dexNumber: { nat: 197 },
    dexName: "Umbreon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  198: {
    dexNumber: { nat: 198 },
    dexName: "Murkrow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  199: {
    dexNumber: { nat: 199 },
    dexName: "Slowking",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.psychic], moves: [] },
    },
  },
  200: {
    dexNumber: { nat: 200 },
    dexName: "Misdreavus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  201: {
    dexNumber: { nat: 201 },
    dexName: "Unown",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  202: {
    dexNumber: { nat: 202 },
    dexName: "Wobbuffet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  203: {
    dexNumber: { nat: 203 },
    dexName: "Girafarig",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.psychic], moves: [] },
    },
  },
  204: {
    dexNumber: { nat: 204 },
    dexName: "Pineco",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  205: {
    dexNumber: { nat: 205 },
    dexName: "Forretress",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  206: {
    dexNumber: { nat: 206 },
    dexName: "Dunsparce",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  207: {
    dexNumber: { nat: 207 },
    dexName: "Gligar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.flying], moves: [] },
    },
  },
  208: {
    dexNumber: { nat: 208 },
    dexName: "Steelix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ground], moves: [] },
      "form-mega-steelix": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ground], moves: [] },
    },
  },
  209: {
    dexNumber: { nat: 209 },
    dexName: "Snubbull",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  210: {
    dexNumber: { nat: 210 },
    dexName: "Granbull",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  211: {
    dexNumber: { nat: 211 },
    dexName: "Qwilfish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.poison], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.poison], moves: [] },
    },
  },
  212: {
    dexNumber: { nat: 212 },
    dexName: "Scizor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
      "form-mega-scizor": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  213: {
    dexNumber: { nat: 213 },
    dexName: "Shuckle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.rock], moves: [] },
    },
  },
  214: {
    dexNumber: { nat: 214 },
    dexName: "Heracross",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fighting], moves: [] },
      "form-mega-heracross": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fighting], moves: [] },
    },
  },
  215: {
    dexNumber: { nat: 215 },
    dexName: "Sneasel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ice], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.poison], moves: [] },
    },
  },
  216: {
    dexNumber: { nat: 216 },
    dexName: "Teddiursa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  217: {
    dexNumber: { nat: 217 },
    dexName: "Ursaring",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  218: {
    dexNumber: { nat: 218 },
    dexName: "Slugma",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  219: {
    dexNumber: { nat: 219 },
    dexName: "Magcargo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.rock], moves: [] },
    },
  },
  220: {
    dexNumber: { nat: 220 },
    dexName: "Swinub",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.ground], moves: [] },
    },
  },
  221: {
    dexNumber: { nat: 221 },
    dexName: "Piloswine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.ground], moves: [] },
    },
  },
  222: {
    dexNumber: { nat: 222 },
    dexName: "Corsola",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.rock], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  223: {
    dexNumber: { nat: 223 },
    dexName: "Remoraid",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  224: {
    dexNumber: { nat: 224 },
    dexName: "Octillery",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  225: {
    dexNumber: { nat: 225 },
    dexName: "Delibird",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.flying], moves: [] },
    },
  },
  226: {
    dexNumber: { nat: 226 },
    dexName: "Mantine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  227: {
    dexNumber: { nat: 227 },
    dexName: "Skarmory",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.flying], moves: [] },
    },
  },
  228: {
    dexNumber: { nat: 228 },
    dexName: "Houndour",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fire], moves: [] },
    },
  },
  229: {
    dexNumber: { nat: 229 },
    dexName: "Houndoom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fire], moves: [] },
      "form-mega-houndoom": { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fire], moves: [] },
    },
  },
  230: {
    dexNumber: { nat: 230 },
    dexName: "Kingdra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dragon], moves: [] },
    },
  },
  231: {
    dexNumber: { nat: 231 },
    dexName: "Phanpy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  232: {
    dexNumber: { nat: 232 },
    dexName: "Donphan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  233: {
    dexNumber: { nat: 233 },
    dexName: "Porygon2",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  234: {
    dexNumber: { nat: 234 },
    dexName: "Stantler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  235: {
    dexNumber: { nat: 235 },
    dexName: "Smeargle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  236: {
    dexNumber: { nat: 236 },
    dexName: "Tyrogue",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  237: {
    dexNumber: { nat: 237 },
    dexName: "Hitmontop",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  238: {
    dexNumber: { nat: 238 },
    dexName: "Smoochum",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.psychic], moves: [] },
    },
  },
  239: {
    dexNumber: { nat: 239 },
    dexName: "Elekid",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  240: {
    dexNumber: { nat: 240 },
    dexName: "Magby",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  241: {
    dexNumber: { nat: 241 },
    dexName: "Miltank",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  242: {
    dexNumber: { nat: 242 },
    dexName: "Blissey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  243: {
    dexNumber: { nat: 243 },
    dexName: "Raikou",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  244: {
    dexNumber: { nat: 244 },
    dexName: "Entei",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  245: {
    dexNumber: { nat: 245 },
    dexName: "Suicune",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  246: {
    dexNumber: { nat: 246 },
    dexName: "Larvitar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
    },
  },
  247: {
    dexNumber: { nat: 247 },
    dexName: "Pupitar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ground], moves: [] },
    },
  },
  248: {
    dexNumber: { nat: 248 },
    dexName: "Tyranitar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.dark], moves: [] },
      "form-mega-tyranitar": { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.dark], moves: [] },
    },
  },
  249: {
    dexNumber: { nat: 249 },
    dexName: "Lugia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  250: {
    dexNumber: { nat: 250 },
    dexName: "Ho-oh",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
    },
  },
  251: {
    dexNumber: { nat: 251 },
    dexName: "Celebi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.grass], moves: [] },
    },
  },
  252: {
    dexNumber: { nat: 252 },
    dexName: "Treecko",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  253: {
    dexNumber: { nat: 253 },
    dexName: "Grovyle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  254: {
    dexNumber: { nat: 254 },
    dexName: "Sceptile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
      "form-mega-sceptile": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  255: {
    dexNumber: { nat: 255 },
    dexName: "Torchic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  256: {
    dexNumber: { nat: 256 },
    dexName: "Combusken",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  257: {
    dexNumber: { nat: 257 },
    dexName: "Blaziken",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
      "form-mega-blaziken": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  258: {
    dexNumber: { nat: 258 },
    dexName: "Mudkip",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  259: {
    dexNumber: { nat: 259 },
    dexName: "Marshtomp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  260: {
    dexNumber: { nat: 260 },
    dexName: "Swampert",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
      "form-mega-swampert": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  261: {
    dexNumber: { nat: 261 },
    dexName: "Poochyena",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  262: {
    dexNumber: { nat: 262 },
    dexName: "Mightyena",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  263: {
    dexNumber: { nat: 263 },
    dexName: "Zigzagoon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.normal], moves: [] },
    },
  },
  264: {
    dexNumber: { nat: 264 },
    dexName: "Linoone",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.normal], moves: [] },
    },
  },
  265: {
    dexNumber: { nat: 265 },
    dexName: "Wurmple",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  266: {
    dexNumber: { nat: 266 },
    dexName: "Silcoon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  267: {
    dexNumber: { nat: 267 },
    dexName: "Beautifly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  268: {
    dexNumber: { nat: 268 },
    dexName: "Cascoon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  269: {
    dexNumber: { nat: 269 },
    dexName: "Dustox",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  270: {
    dexNumber: { nat: 270 },
    dexName: "Lotad",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.grass], moves: [] },
    },
  },
  271: {
    dexNumber: { nat: 271 },
    dexName: "Lombre",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.grass], moves: [] },
    },
  },
  272: {
    dexNumber: { nat: 272 },
    dexName: "Ludicolo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.grass], moves: [] },
    },
  },
  273: {
    dexNumber: { nat: 273 },
    dexName: "Seedot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  274: {
    dexNumber: { nat: 274 },
    dexName: "Nuzleaf",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dark], moves: [] },
    },
  },
  275: {
    dexNumber: { nat: 275 },
    dexName: "Shiftry",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dark], moves: [] },
    },
  },
  276: {
    dexNumber: { nat: 276 },
    dexName: "Taillow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  277: {
    dexNumber: { nat: 277 },
    dexName: "Swellow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  278: {
    dexNumber: { nat: 278 },
    dexName: "Wingull",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  279: {
    dexNumber: { nat: 279 },
    dexName: "Pelipper",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  280: {
    dexNumber: { nat: 280 },
    dexName: "Ralts",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  281: {
    dexNumber: { nat: 281 },
    dexName: "Kirlia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  282: {
    dexNumber: { nat: 282 },
    dexName: "Gardevoir",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
      "form-mega-gardevoir": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  283: {
    dexNumber: { nat: 283 },
    dexName: "Surskit",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.water], moves: [] },
    },
  },
  284: {
    dexNumber: { nat: 284 },
    dexName: "Masquerain",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  285: {
    dexNumber: { nat: 285 },
    dexName: "Shroomish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  286: {
    dexNumber: { nat: 286 },
    dexName: "Breloom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fighting], moves: [] },
    },
  },
  287: {
    dexNumber: { nat: 287 },
    dexName: "Slakoth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  288: {
    dexNumber: { nat: 288 },
    dexName: "Vigoroth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  289: {
    dexNumber: { nat: 289 },
    dexName: "Slaking",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  290: {
    dexNumber: { nat: 290 },
    dexName: "Nincada",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.ground], moves: [] },
    },
  },
  291: {
    dexNumber: { nat: 291 },
    dexName: "Ninjask",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  292: {
    dexNumber: { nat: 292 },
    dexName: "Shedinja",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.ghost], moves: [] },
    },
  },
  293: {
    dexNumber: { nat: 293 },
    dexName: "Whismur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  294: {
    dexNumber: { nat: 294 },
    dexName: "Loudred",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  295: {
    dexNumber: { nat: 295 },
    dexName: "Exploud",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  296: {
    dexNumber: { nat: 296 },
    dexName: "Makuhita",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  297: {
    dexNumber: { nat: 297 },
    dexName: "Hariyama",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  298: {
    dexNumber: { nat: 298 },
    dexName: "Azurill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fairy], moves: [] },
    },
  },
  299: {
    dexNumber: { nat: 299 },
    dexName: "Nosepass",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  300: {
    dexNumber: { nat: 300 },
    dexName: "Skitty",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  301: {
    dexNumber: { nat: 301 },
    dexName: "Delcatty",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  302: {
    dexNumber: { nat: 302 },
    dexName: "Sableye",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ghost], moves: [] },
      "form-mega-sableye": { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ghost], moves: [] },
    },
  },
  303: {
    dexNumber: { nat: 303 },
    dexName: "Mawile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.fairy], moves: [] },
      "form-mega-mawile": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.fairy], moves: [] },
    },
  },
  304: {
    dexNumber: { nat: 304 },
    dexName: "Aron",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.rock], moves: [] },
    },
  },
  305: {
    dexNumber: { nat: 305 },
    dexName: "Lairon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.rock], moves: [] },
    },
  },
  306: {
    dexNumber: { nat: 306 },
    dexName: "Aggron",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.rock], moves: [] },
      "form-mega-aggron": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  307: {
    dexNumber: { nat: 307 },
    dexName: "Meditite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.psychic], moves: [] },
    },
  },
  308: {
    dexNumber: { nat: 308 },
    dexName: "Medicham",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.psychic], moves: [] },
      "form-mega-medicham": { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.psychic], moves: [] },
    },
  },
  309: {
    dexNumber: { nat: 309 },
    dexName: "Electrike",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  310: {
    dexNumber: { nat: 310 },
    dexName: "Manectric",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
      "form-mega-manectric": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  311: {
    dexNumber: { nat: 311 },
    dexName: "Plusle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  312: {
    dexNumber: { nat: 312 },
    dexName: "Minun",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  313: {
    dexNumber: { nat: 313 },
    dexName: "Volbeat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  314: {
    dexNumber: { nat: 314 },
    dexName: "Illumise",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  315: {
    dexNumber: { nat: 315 },
    dexName: "Roselia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  316: {
    dexNumber: { nat: 316 },
    dexName: "Gulpin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  317: {
    dexNumber: { nat: 317 },
    dexName: "Swalot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  318: {
    dexNumber: { nat: 318 },
    dexName: "Carvanha",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  319: {
    dexNumber: { nat: 319 },
    dexName: "Sharpedo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
      "form-mega-sharpedo": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  320: {
    dexNumber: { nat: 320 },
    dexName: "Wailmer",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  321: {
    dexNumber: { nat: 321 },
    dexName: "Wailord",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  322: {
    dexNumber: { nat: 322 },
    dexName: "Numel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ground], moves: [] },
    },
  },
  323: {
    dexNumber: { nat: 323 },
    dexName: "Camerupt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ground], moves: [] },
      "form-mega-camerupt": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ground], moves: [] },
    },
  },
  324: {
    dexNumber: { nat: 324 },
    dexName: "Torkoal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  325: {
    dexNumber: { nat: 325 },
    dexName: "Spoink",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  326: {
    dexNumber: { nat: 326 },
    dexName: "Grumpig",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  327: {
    dexNumber: { nat: 327 },
    dexName: "Spinda",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  328: {
    dexNumber: { nat: 328 },
    dexName: "Trapinch",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  329: {
    dexNumber: { nat: 329 },
    dexName: "Vibrava",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.dragon], moves: [] },
    },
  },
  330: {
    dexNumber: { nat: 330 },
    dexName: "Flygon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.dragon], moves: [] },
    },
  },
  331: {
    dexNumber: { nat: 331 },
    dexName: "Cacnea",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  332: {
    dexNumber: { nat: 332 },
    dexName: "Cacturne",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dark], moves: [] },
    },
  },
  333: {
    dexNumber: { nat: 333 },
    dexName: "Swablu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  334: {
    dexNumber: { nat: 334 },
    dexName: "Altaria",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.flying], moves: [] },
      "form-mega-altaria": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.fairy], moves: [] },
    },
  },
  335: {
    dexNumber: { nat: 335 },
    dexName: "Zangoose",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  336: {
    dexNumber: { nat: 336 },
    dexName: "Seviper",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  337: {
    dexNumber: { nat: 337 },
    dexName: "Lunatone",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.psychic], moves: [] },
    },
  },
  338: {
    dexNumber: { nat: 338 },
    dexName: "Solrock",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.psychic], moves: [] },
    },
  },
  339: {
    dexNumber: { nat: 339 },
    dexName: "Barboach",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  340: {
    dexNumber: { nat: 340 },
    dexName: "Whiscash",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  341: {
    dexNumber: { nat: 341 },
    dexName: "Corphish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  342: {
    dexNumber: { nat: 342 },
    dexName: "Crawdaunt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  343: {
    dexNumber: { nat: 343 },
    dexName: "Baltoy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.psychic], moves: [] },
    },
  },
  344: {
    dexNumber: { nat: 344 },
    dexName: "Claydol",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.psychic], moves: [] },
    },
  },
  345: {
    dexNumber: { nat: 345 },
    dexName: "Lileep",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.grass], moves: [] },
    },
  },
  346: {
    dexNumber: { nat: 346 },
    dexName: "Cradily",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.grass], moves: [] },
    },
  },
  347: {
    dexNumber: { nat: 347 },
    dexName: "Anorith",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.bug], moves: [] },
    },
  },
  348: {
    dexNumber: { nat: 348 },
    dexName: "Armaldo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.bug], moves: [] },
    },
  },
  349: {
    dexNumber: { nat: 349 },
    dexName: "Feebas",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  350: {
    dexNumber: { nat: 350 },
    dexName: "Milotic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  351: {
    dexNumber: { nat: 351 },
    dexName: "Castform",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-sunny-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      "form-rainy-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      "form-snowy-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  352: {
    dexNumber: { nat: 352 },
    dexName: "Kecleon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  353: {
    dexNumber: { nat: 353 },
    dexName: "Shuppet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  354: {
    dexNumber: { nat: 354 },
    dexName: "Banette",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
      "form-mega-banette": { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  355: {
    dexNumber: { nat: 355 },
    dexName: "Duskull",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  356: {
    dexNumber: { nat: 356 },
    dexName: "Dusclops",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  357: {
    dexNumber: { nat: 357 },
    dexName: "Tropius",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  358: {
    dexNumber: { nat: 358 },
    dexName: "Chimecho",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  359: {
    dexNumber: { nat: 359 },
    dexName: "Absol",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
      "form-mega-absol": { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  360: {
    dexNumber: { nat: 360 },
    dexName: "Wynaut",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  361: {
    dexNumber: { nat: 361 },
    dexName: "Snorunt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  362: {
    dexNumber: { nat: 362 },
    dexName: "Glalie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
      "form-mega-glalie": { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  363: {
    dexNumber: { nat: 363 },
    dexName: "Spheal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.water], moves: [] },
    },
  },
  364: {
    dexNumber: { nat: 364 },
    dexName: "Sealeo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.water], moves: [] },
    },
  },
  365: {
    dexNumber: { nat: 365 },
    dexName: "Walrein",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.water], moves: [] },
    },
  },
  366: {
    dexNumber: { nat: 366 },
    dexName: "Clamperl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  367: {
    dexNumber: { nat: 367 },
    dexName: "Huntail",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  368: {
    dexNumber: { nat: 368 },
    dexName: "Gorebyss",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  369: {
    dexNumber: { nat: 369 },
    dexName: "Relicanth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.rock], moves: [] },
    },
  },
  370: {
    dexNumber: { nat: 370 },
    dexName: "Luvdisc",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  371: {
    dexNumber: { nat: 371 },
    dexName: "Bagon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  372: {
    dexNumber: { nat: 372 },
    dexName: "Shelgon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  373: {
    dexNumber: { nat: 373 },
    dexName: "Salamence",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.flying], moves: [] },
      "form-mega-salamence": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.flying], moves: [] },
    },
  },
  374: {
    dexNumber: { nat: 374 },
    dexName: "Beldum",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  375: {
    dexNumber: { nat: 375 },
    dexName: "Metang",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  376: {
    dexNumber: { nat: 376 },
    dexName: "Metagross",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
      "form-mega-metagross": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  377: {
    dexNumber: { nat: 377 },
    dexName: "Regirock",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  378: {
    dexNumber: { nat: 378 },
    dexName: "Regice",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  379: {
    dexNumber: { nat: 379 },
    dexName: "Registeel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  380: {
    dexNumber: { nat: 380 },
    dexName: "Latias",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.psychic], moves: [] },
      "form-mega-latias": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.psychic], moves: [] },
    },
  },
  381: {
    dexNumber: { nat: 381 },
    dexName: "Latios",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.psychic], moves: [] },
      "form-mega-latios": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.psychic], moves: [] },
    },
  },
  382: {
    dexNumber: { nat: 382 },
    dexName: "Kyogre",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      "form-primal-kyogre": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  383: {
    dexNumber: { nat: 383 },
    dexName: "Groudon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
      "form-primal-groudon": { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.fire], moves: [] },
    },
  },
  384: {
    dexNumber: { nat: 384 },
    dexName: "Rayquaza",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.flying], moves: [] },
      "form-mega-rayquaza": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.flying], moves: [] },
    },
  },
  385: {
    dexNumber: { nat: 385 },
    dexName: "Jirachi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  386: {
    dexNumber: { nat: 386 },
    dexName: "Deoxys",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-attack-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-defense-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-speed-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  387: {
    dexNumber: { nat: 387 },
    dexName: "Turtwig",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  388: {
    dexNumber: { nat: 388 },
    dexName: "Grotle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  389: {
    dexNumber: { nat: 389 },
    dexName: "Torterra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ground], moves: [] },
    },
  },
  390: {
    dexNumber: { nat: 390 },
    dexName: "Chimchar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  391: {
    dexNumber: { nat: 391 },
    dexName: "Monferno",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  392: {
    dexNumber: { nat: 392 },
    dexName: "Infernape",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  393: {
    dexNumber: { nat: 393 },
    dexName: "Piplup",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  394: {
    dexNumber: { nat: 394 },
    dexName: "Prinplup",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  395: {
    dexNumber: { nat: 395 },
    dexName: "Empoleon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.steel], moves: [] },
    },
  },
  396: {
    dexNumber: { nat: 396 },
    dexName: "Starly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  397: {
    dexNumber: { nat: 397 },
    dexName: "Staravia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  398: {
    dexNumber: { nat: 398 },
    dexName: "Staraptor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  399: {
    dexNumber: { nat: 399 },
    dexName: "Bidoof",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  400: {
    dexNumber: { nat: 400 },
    dexName: "Bibarel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.water], moves: [] },
    },
  },
  401: {
    dexNumber: { nat: 401 },
    dexName: "Kricketot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  402: {
    dexNumber: { nat: 402 },
    dexName: "Kricketune",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  403: {
    dexNumber: { nat: 403 },
    dexName: "Shinx",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  404: {
    dexNumber: { nat: 404 },
    dexName: "Luxio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  405: {
    dexNumber: { nat: 405 },
    dexName: "Luxray",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  406: {
    dexNumber: { nat: 406 },
    dexName: "Budew",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  407: {
    dexNumber: { nat: 407 },
    dexName: "Roserade",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  408: {
    dexNumber: { nat: 408 },
    dexName: "Cranidos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  409: {
    dexNumber: { nat: 409 },
    dexName: "Rampardos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  410: {
    dexNumber: { nat: 410 },
    dexName: "Shieldon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.steel], moves: [] },
    },
  },
  411: {
    dexNumber: { nat: 411 },
    dexName: "Bastiodon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.steel], moves: [] },
    },
  },
  412: {
    dexNumber: { nat: 412 },
    dexName: "Burmy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
      "form-sandy-cloak": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
      "form-trash-cloak": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  413: {
    dexNumber: { nat: 413 },
    dexName: "Wormadam",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
      "form-sandy-cloak": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.ground], moves: [] },
      "form-trash-cloak": { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  414: {
    dexNumber: { nat: 414 },
    dexName: "Mothim",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  415: {
    dexNumber: { nat: 415 },
    dexName: "Combee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  416: {
    dexNumber: { nat: 416 },
    dexName: "Vespiquen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  417: {
    dexNumber: { nat: 417 },
    dexName: "Pachirisu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  418: {
    dexNumber: { nat: 418 },
    dexName: "Buizel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  419: {
    dexNumber: { nat: 419 },
    dexName: "Floatzel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  420: {
    dexNumber: { nat: 420 },
    dexName: "Cherubi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  421: {
    dexNumber: { nat: 421 },
    dexName: "Cherrim",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  422: {
    dexNumber: { nat: 422 },
    dexName: "Shellos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  423: {
    dexNumber: { nat: 423 },
    dexName: "Gastrodon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  424: {
    dexNumber: { nat: 424 },
    dexName: "Ambipom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  425: {
    dexNumber: { nat: 425 },
    dexName: "Drifloon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.flying], moves: [] },
    },
  },
  426: {
    dexNumber: { nat: 426 },
    dexName: "Drifblim",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.flying], moves: [] },
    },
  },
  427: {
    dexNumber: { nat: 427 },
    dexName: "Buneary",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  428: {
    dexNumber: { nat: 428 },
    dexName: "Lopunny",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-mega-lopunny": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fighting], moves: [] },
    },
  },
  429: {
    dexNumber: { nat: 429 },
    dexName: "Mismagius",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  430: {
    dexNumber: { nat: 430 },
    dexName: "Honchkrow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  431: {
    dexNumber: { nat: 431 },
    dexName: "Glameow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  432: {
    dexNumber: { nat: 432 },
    dexName: "Purugly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  433: {
    dexNumber: { nat: 433 },
    dexName: "Chingling",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  434: {
    dexNumber: { nat: 434 },
    dexName: "Stunky",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dark], moves: [] },
    },
  },
  435: {
    dexNumber: { nat: 435 },
    dexName: "Skuntank",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dark], moves: [] },
    },
  },
  436: {
    dexNumber: { nat: 436 },
    dexName: "Bronzor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  437: {
    dexNumber: { nat: 437 },
    dexName: "Bronzong",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  438: {
    dexNumber: { nat: 438 },
    dexName: "Bonsly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  439: {
    dexNumber: { nat: 439 },
    dexName: "Mime Jr.",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  440: {
    dexNumber: { nat: 440 },
    dexName: "Happiny",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  441: {
    dexNumber: { nat: 441 },
    dexName: "Chatot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  442: {
    dexNumber: { nat: 442 },
    dexName: "Spiritomb",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.dark], moves: [] },
    },
  },
  443: {
    dexNumber: { nat: 443 },
    dexName: "Gible",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
    },
  },
  444: {
    dexNumber: { nat: 444 },
    dexName: "Gabite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
    },
  },
  445: {
    dexNumber: { nat: 445 },
    dexName: "Garchomp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
      "form-mega-garchomp": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
    },
  },
  446: {
    dexNumber: { nat: 446 },
    dexName: "Munchlax",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  447: {
    dexNumber: { nat: 447 },
    dexName: "Riolu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  448: {
    dexNumber: { nat: 448 },
    dexName: "Lucario",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.steel], moves: [] },
      "form-mega-lucario": { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.steel], moves: [] },
    },
  },
  449: {
    dexNumber: { nat: 449 },
    dexName: "Hippopotas",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  450: {
    dexNumber: { nat: 450 },
    dexName: "Hippowdon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  451: {
    dexNumber: { nat: 451 },
    dexName: "Skorupi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.bug], moves: [] },
    },
  },
  452: {
    dexNumber: { nat: 452 },
    dexName: "Drapion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dark], moves: [] },
    },
  },
  453: {
    dexNumber: { nat: 453 },
    dexName: "Croagunk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fighting], moves: [] },
    },
  },
  454: {
    dexNumber: { nat: 454 },
    dexName: "Toxicroak",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fighting], moves: [] },
    },
  },
  455: {
    dexNumber: { nat: 455 },
    dexName: "Carnivine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  456: {
    dexNumber: { nat: 456 },
    dexName: "Finneon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  457: {
    dexNumber: { nat: 457 },
    dexName: "Lumineon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  458: {
    dexNumber: { nat: 458 },
    dexName: "Mantyke",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  459: {
    dexNumber: { nat: 459 },
    dexName: "Snover",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ice], moves: [] },
    },
  },
  460: {
    dexNumber: { nat: 460 },
    dexName: "Abomasnow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ice], moves: [] },
      "form-mega-abomasnow": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ice], moves: [] },
    },
  },
  461: {
    dexNumber: { nat: 461 },
    dexName: "Weavile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ice], moves: [] },
    },
  },
  462: {
    dexNumber: { nat: 462 },
    dexName: "Magnezone",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.steel], moves: [] },
    },
  },
  463: {
    dexNumber: { nat: 463 },
    dexName: "Lickilicky",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  464: {
    dexNumber: { nat: 464 },
    dexName: "Rhyperior",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.rock], moves: [] },
    },
  },
  465: {
    dexNumber: { nat: 465 },
    dexName: "Tangrowth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  466: {
    dexNumber: { nat: 466 },
    dexName: "Electivire",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  467: {
    dexNumber: { nat: 467 },
    dexName: "Magmortar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  468: {
    dexNumber: { nat: 468 },
    dexName: "Togekiss",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.flying], moves: [] },
    },
  },
  469: {
    dexNumber: { nat: 469 },
    dexName: "Yanmega",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  470: {
    dexNumber: { nat: 470 },
    dexName: "Leafeon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  471: {
    dexNumber: { nat: 471 },
    dexName: "Glaceon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  472: {
    dexNumber: { nat: 472 },
    dexName: "Gliscor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.flying], moves: [] },
    },
  },
  473: {
    dexNumber: { nat: 473 },
    dexName: "Mamoswine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.ground], moves: [] },
    },
  },
  474: {
    dexNumber: { nat: 474 },
    dexName: "Porygon-Z",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  475: {
    dexNumber: { nat: 475 },
    dexName: "Gallade",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fighting], moves: [] },
      "form-mega-gallade": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fighting], moves: [] },
    },
  },
  476: {
    dexNumber: { nat: 476 },
    dexName: "Probopass",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.steel], moves: [] },
    },
  },
  477: {
    dexNumber: { nat: 477 },
    dexName: "Dusknoir",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  478: {
    dexNumber: { nat: 478 },
    dexName: "Froslass",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.ghost], moves: [] },
    },
  },
  479: {
    dexNumber: { nat: 479 },
    dexName: "Rotom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.ghost], moves: [] },
      [FORM_IDS.heat]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.fire], moves: [] },
      [FORM_IDS.wash]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.water], moves: [] },
      [FORM_IDS.frost]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.ice], moves: [] },
      [FORM_IDS.fan]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
      [FORM_IDS.grass]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.grass], moves: [] },
    },
  },
  480: {
    dexNumber: { nat: 480 },
    dexName: "Uxie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  481: {
    dexNumber: { nat: 481 },
    dexName: "Mesprit",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  482: {
    dexNumber: { nat: 482 },
    dexName: "Azelf",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  483: {
    dexNumber: { nat: 483 },
    dexName: "Dialga",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.dragon], moves: [] },
      "form-origin-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.dragon], moves: [] },
    },
  },
  484: {
    dexNumber: { nat: 484 },
    dexName: "Palkia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dragon], moves: [] },
      "form-origin-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dragon], moves: [] },
    },
  },
  485: {
    dexNumber: { nat: 485 },
    dexName: "Heatran",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.steel], moves: [] },
    },
  },
  486: {
    dexNumber: { nat: 486 },
    dexName: "Regigigas",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  487: {
    dexNumber: { nat: 487 },
    dexName: "Giratina",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.dragon], moves: [] },
      "form-origin-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.dragon], moves: [] },
    },
  },
  488: {
    dexNumber: { nat: 488 },
    dexName: "Cresselia",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  489: {
    dexNumber: { nat: 489 },
    dexName: "Phione",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  490: {
    dexNumber: { nat: 490 },
    dexName: "Manaphy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  491: {
    dexNumber: { nat: 491 },
    dexName: "Darkrai",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  492: {
    dexNumber: { nat: 492 },
    dexName: "Shaymin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-sky-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  493: {
    dexNumber: { nat: 493 },
    dexName: "Arceus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  494: {
    dexNumber: { nat: 494 },
    dexName: "Victini",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fire], moves: [] },
    },
  },
  495: {
    dexNumber: { nat: 495 },
    dexName: "Snivy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  496: {
    dexNumber: { nat: 496 },
    dexName: "Servine",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  497: {
    dexNumber: { nat: 497 },
    dexName: "Serperior",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  498: {
    dexNumber: { nat: 498 },
    dexName: "Tepig",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  499: {
    dexNumber: { nat: 499 },
    dexName: "Pignite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  500: {
    dexNumber: { nat: 500 },
    dexName: "Emboar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.fighting], moves: [] },
    },
  },
  501: {
    dexNumber: { nat: 501 },
    dexName: "Oshawott",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  502: {
    dexNumber: { nat: 502 },
    dexName: "Dewott",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  503: {
    dexNumber: { nat: 503 },
    dexName: "Samurott",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  504: {
    dexNumber: { nat: 504 },
    dexName: "Patrat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  505: {
    dexNumber: { nat: 505 },
    dexName: "Watchog",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  506: {
    dexNumber: { nat: 506 },
    dexName: "Lillipup",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  507: {
    dexNumber: { nat: 507 },
    dexName: "Herdier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  508: {
    dexNumber: { nat: 508 },
    dexName: "Stoutland",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  509: {
    dexNumber: { nat: 509 },
    dexName: "Purrloin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  510: {
    dexNumber: { nat: 510 },
    dexName: "Liepard",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  511: {
    dexNumber: { nat: 511 },
    dexName: "Pansage",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  512: {
    dexNumber: { nat: 512 },
    dexName: "Simisage",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  513: {
    dexNumber: { nat: 513 },
    dexName: "Pansear",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  514: {
    dexNumber: { nat: 514 },
    dexName: "Simisear",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  515: {
    dexNumber: { nat: 515 },
    dexName: "Panpour",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  516: {
    dexNumber: { nat: 516 },
    dexName: "Simipour",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  517: {
    dexNumber: { nat: 517 },
    dexName: "Munna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  518: {
    dexNumber: { nat: 518 },
    dexName: "Musharna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  519: {
    dexNumber: { nat: 519 },
    dexName: "Pidove",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  520: {
    dexNumber: { nat: 520 },
    dexName: "Tranquill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  521: {
    dexNumber: { nat: 521 },
    dexName: "Unfezant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  522: {
    dexNumber: { nat: 522 },
    dexName: "Blitzle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  523: {
    dexNumber: { nat: 523 },
    dexName: "Zebstrika",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  524: {
    dexNumber: { nat: 524 },
    dexName: "Roggenrola",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  525: {
    dexNumber: { nat: 525 },
    dexName: "Boldore",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  526: {
    dexNumber: { nat: 526 },
    dexName: "Gigalith",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  527: {
    dexNumber: { nat: 527 },
    dexName: "Woobat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  528: {
    dexNumber: { nat: 528 },
    dexName: "Swoobat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  529: {
    dexNumber: { nat: 529 },
    dexName: "Drilbur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  530: {
    dexNumber: { nat: 530 },
    dexName: "Excadrill",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.steel], moves: [] },
    },
  },
  531: {
    dexNumber: { nat: 531 },
    dexName: "Audino",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-mega-audino": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fairy], moves: [] },
    },
  },
  532: {
    dexNumber: { nat: 532 },
    dexName: "Timburr",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  533: {
    dexNumber: { nat: 533 },
    dexName: "Gurdurr",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  534: {
    dexNumber: { nat: 534 },
    dexName: "Conkeldurr",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  535: {
    dexNumber: { nat: 535 },
    dexName: "Tympole",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  536: {
    dexNumber: { nat: 536 },
    dexName: "Palpitoad",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  537: {
    dexNumber: { nat: 537 },
    dexName: "Seismitoad",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ground], moves: [] },
    },
  },
  538: {
    dexNumber: { nat: 538 },
    dexName: "Throh",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  539: {
    dexNumber: { nat: 539 },
    dexName: "Sawk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  540: {
    dexNumber: { nat: 540 },
    dexName: "Sewaddle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
    },
  },
  541: {
    dexNumber: { nat: 541 },
    dexName: "Swadloon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
    },
  },
  542: {
    dexNumber: { nat: 542 },
    dexName: "Leavanny",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.grass], moves: [] },
    },
  },
  543: {
    dexNumber: { nat: 543 },
    dexName: "Venipede",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  544: {
    dexNumber: { nat: 544 },
    dexName: "Whirlipede",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  545: {
    dexNumber: { nat: 545 },
    dexName: "Scolipede",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.poison], moves: [] },
    },
  },
  546: {
    dexNumber: { nat: 546 },
    dexName: "Cottonee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fairy], moves: [] },
    },
  },
  547: {
    dexNumber: { nat: 547 },
    dexName: "Whimsicott",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 135,
        attack: 87,
        defense: 105,
        spAtk: 97,
        spDef: 95,
        speed: 136,
        types: [TYPES.grass, TYPES.fairy],
        moves: [
          MOVES.gigaImpact,
          MOVES.facade,
          MOVES.endeavor,
          MOVES.hyperBeam,
          MOVES.round,
          MOVES.snore,
          MOVES.tickle,
          MOVES.helpingHand,
          MOVES.encore,
          MOVES.safeGuard,
          MOVES.sleepTalk,
          MOVES.attract,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.seedBomb,
          MOVES.grassyGlide,
          MOVES.solarBeam,
          MOVES.energyBall,
          MOVES.gigaDrain,
          MOVES.grassKnot,
          MOVES.grassyTerrain,
          MOVES.cottonGuard,
          MOVES.worrySeed,
          MOVES.cottonSpore,
          MOVES.stunSpore,
          MOVES.growth,
          MOVES.leechSeed,
          MOVES.sunnyDay,
          MOVES.uTurn,
          MOVES.hurricane,
          MOVES.tailwind,
          MOVES.poisonPowder,
          MOVES.psychic,
          MOVES.trickRoom,
          MOVES.rest,
          MOVES.lightScreen,
          MOVES.shadowBall,
          MOVES.thief,
          MOVES.fling,
          MOVES.beatUp,
          MOVES.switcheroo,
          MOVES.fakeTears,
          MOVES.taunt,
          MOVES.memento,
          MOVES.playRough,
          MOVES.moonblast,
          MOVES.dazzlingGleam,
          MOVES.mistyTerrain,
          MOVES.charm,
        ]
      }
    },
  },
  548: {
    dexNumber: { nat: 548 },
    dexName: "Petilil",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  549: {
    dexNumber: { nat: 549 },
    dexName: "Lilligant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fighting], moves: [] },
    },
  },
  550: {
    dexNumber: { nat: 550 },
    dexName: "Basculin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      "form-blue-striped-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      "form-white-striped-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  551: {
    dexNumber: { nat: 551 },
    dexName: "Sandile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.dark], moves: [] },
    },
  },
  552: {
    dexNumber: { nat: 552 },
    dexName: "Krokorok",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.dark], moves: [] },
    },
  },
  553: {
    dexNumber: { nat: 553 },
    dexName: "Krookodile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.dark], moves: [] },
    },
  },
  554: {
    dexNumber: { nat: 554 },
    dexName: "Darumaka",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  555: {
    dexNumber: { nat: 555 },
    dexName: "Darmanitan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
      "form-zen-mode": { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.psychic], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
      "form-galarian-zen-mode": { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.fire], moves: [] },
    },
  },
  556: {
    dexNumber: { nat: 556 },
    dexName: "Maractus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  557: {
    dexNumber: { nat: 557 },
    dexName: "Dwebble",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.rock], moves: [] },
    },
  },
  558: {
    dexNumber: { nat: 558 },
    dexName: "Crustle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.rock], moves: [] },
    },
  },
  559: {
    dexNumber: { nat: 559 },
    dexName: "Scraggy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fighting], moves: [] },
    },
  },
  560: {
    dexNumber: { nat: 560 },
    dexName: "Scrafty",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fighting], moves: [] },
    },
  },
  561: {
    dexNumber: { nat: 561 },
    dexName: "Sigilyph",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  562: {
    dexNumber: { nat: 562 },
    dexName: "Yamask",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.ghost], moves: [] },
    },
  },
  563: {
    dexNumber: { nat: 563 },
    dexName: "Cofagrigus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  564: {
    dexNumber: { nat: 564 },
    dexName: "Tirtouga",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.rock], moves: [] },
    },
  },
  565: {
    dexNumber: { nat: 565 },
    dexName: "Carracosta",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.rock], moves: [] },
    },
  },
  566: {
    dexNumber: { nat: 566 },
    dexName: "Archen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
    },
  },
  567: {
    dexNumber: { nat: 567 },
    dexName: "Archeops",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
    },
  },
  568: {
    dexNumber: { nat: 568 },
    dexName: "Trubbish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  569: {
    dexNumber: { nat: 569 },
    dexName: "Garbodor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  570: {
    dexNumber: { nat: 570 },
    dexName: "Zorua",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.ghost], moves: [] },
    },
  },
  571: {
    dexNumber: { nat: 571 },
    dexName: "Zoroark",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.ghost], moves: [] },
    },
  },
  572: {
    dexNumber: { nat: 572 },
    dexName: "Minccino",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  573: {
    dexNumber: { nat: 573 },
    dexName: "Cinccino",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  574: {
    dexNumber: { nat: 574 },
    dexName: "Gothita",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  575: {
    dexNumber: { nat: 575 },
    dexName: "Gothorita",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  576: {
    dexNumber: { nat: 576 },
    dexName: "Gothitelle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  577: {
    dexNumber: { nat: 577 },
    dexName: "Solosis",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  578: {
    dexNumber: { nat: 578 },
    dexName: "Duosion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  579: {
    dexNumber: { nat: 579 },
    dexName: "Reuniclus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  580: {
    dexNumber: { nat: 580 },
    dexName: "Ducklett",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  581: {
    dexNumber: { nat: 581 },
    dexName: "Swanna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.flying], moves: [] },
    },
  },
  582: {
    dexNumber: { nat: 582 },
    dexName: "Vanillite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  583: {
    dexNumber: { nat: 583 },
    dexName: "Vanillish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  584: {
    dexNumber: { nat: 584 },
    dexName: "Vanilluxe",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  585: {
    dexNumber: { nat: 585 },
    dexName: "Deerling",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.grass], moves: [] },
    },
  },
  586: {
    dexNumber: { nat: 586 },
    dexName: "Sawsbuck",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.grass], moves: [] },
    },
  },
  587: {
    dexNumber: { nat: 587 },
    dexName: "Emolga",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
    },
  },
  588: {
    dexNumber: { nat: 588 },
    dexName: "Karrablast",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  589: {
    dexNumber: { nat: 589 },
    dexName: "Escavalier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  590: {
    dexNumber: { nat: 590 },
    dexName: "Foongus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  591: {
    dexNumber: { nat: 591 },
    dexName: "Amoonguss",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.poison], moves: [] },
    },
  },
  592: {
    dexNumber: { nat: 592 },
    dexName: "Frillish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ghost], moves: [] },
    },
  },
  593: {
    dexNumber: { nat: 593 },
    dexName: "Jellicent",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ghost], moves: [] },
    },
  },
  594: {
    dexNumber: { nat: 594 },
    dexName: "Alomomola",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  595: {
    dexNumber: { nat: 595 },
    dexName: "Joltik",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.electric], moves: [] },
    },
  },
  596: {
    dexNumber: { nat: 596 },
    dexName: "Galvantula",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.electric], moves: [] },
    },
  },
  597: {
    dexNumber: { nat: 597 },
    dexName: "Ferroseed",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.steel], moves: [] },
    },
  },
  598: {
    dexNumber: { nat: 598 },
    dexName: "Ferrothorn",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.steel], moves: [] },
    },
  },
  599: {
    dexNumber: { nat: 599 },
    dexName: "Klink",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  600: {
    dexNumber: { nat: 600 },
    dexName: "Klang",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  601: {
    dexNumber: { nat: 601 },
    dexName: "Klinklang",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  602: {
    dexNumber: { nat: 602 },
    dexName: "Tynamo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  603: {
    dexNumber: { nat: 603 },
    dexName: "Eelektrik",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  604: {
    dexNumber: { nat: 604 },
    dexName: "Eelektross",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  605: {
    dexNumber: { nat: 605 },
    dexName: "Elgyem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  606: {
    dexNumber: { nat: 606 },
    dexName: "Beheeyem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  607: {
    dexNumber: { nat: 607 },
    dexName: "Litwick",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.fire], moves: [] },
    },
  },
  608: {
    dexNumber: { nat: 608 },
    dexName: "Lampent",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.fire], moves: [] },
    },
  },
  609: {
    dexNumber: { nat: 609 },
    dexName: "Chandelure",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.fire], moves: [] },
    },
  },
  610: {
    dexNumber: { nat: 610 },
    dexName: "Axew",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  611: {
    dexNumber: { nat: 611 },
    dexName: "Fraxure",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  612: {
    dexNumber: { nat: 612 },
    dexName: "Haxorus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  613: {
    dexNumber: { nat: 613 },
    dexName: "Cubchoo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  614: {
    dexNumber: { nat: 614 },
    dexName: "Beartic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  615: {
    dexNumber: { nat: 615 },
    dexName: "Cryogonal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  616: {
    dexNumber: { nat: 616 },
    dexName: "Shelmet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  617: {
    dexNumber: { nat: 617 },
    dexName: "Accelgor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  618: {
    dexNumber: { nat: 618 },
    dexName: "Stunfisk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.electric], moves: [] },
      [FORM_IDS.galarian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.steel], moves: [] },
    },
  },
  619: {
    dexNumber: { nat: 619 },
    dexName: "Mienfoo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  620: {
    dexNumber: { nat: 620 },
    dexName: "Mienshao",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  621: {
    dexNumber: { nat: 621 },
    dexName: "Druddigon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  622: {
    dexNumber: { nat: 622 },
    dexName: "Golett",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.ghost], moves: [] },
    },
  },
  623: {
    dexNumber: { nat: 623 },
    dexName: "Golurk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.ghost], moves: [] },
    },
  },
  624: {
    dexNumber: { nat: 624 },
    dexName: "Pawniard",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.steel], moves: [] },
    },
  },
  625: {
    dexNumber: { nat: 625 },
    dexName: "Bisharp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.steel], moves: [] },
    },
  },
  626: {
    dexNumber: { nat: 626 },
    dexName: "Bouffalant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  627: {
    dexNumber: { nat: 627 },
    dexName: "Rufflet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  628: {
    dexNumber: { nat: 628 },
    dexName: "Braviary",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
    },
  },
  629: {
    dexNumber: { nat: 629 },
    dexName: "Vullaby",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  630: {
    dexNumber: { nat: 630 },
    dexName: "Mandibuzz",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  631: {
    dexNumber: { nat: 631 },
    dexName: "Heatmor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  632: {
    dexNumber: { nat: 632 },
    dexName: "Durant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  633: {
    dexNumber: { nat: 633 },
    dexName: "Deino",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.dragon], moves: [] },
    },
  },
  634: {
    dexNumber: { nat: 634 },
    dexName: "Zweilous",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.dragon], moves: [] },
    },
  },
  635: {
    dexNumber: { nat: 635 },
    dexName: "Hydreigon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.dragon], moves: [] },
    },
  },
  636: {
    dexNumber: { nat: 636 },
    dexName: "Larvesta",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fire], moves: [] },
    },
  },
  637: {
    dexNumber: { nat: 637 },
    dexName: "Volcarona",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fire], moves: [] },
    },
  },
  638: {
    dexNumber: { nat: 638 },
    dexName: "Cobalion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.fighting], moves: [] },
    },
  },
  639: {
    dexNumber: { nat: 639 },
    dexName: "Terrakion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fighting], moves: [] },
    },
  },
  640: {
    dexNumber: { nat: 640 },
    dexName: "Virizion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fighting], moves: [] },
    },
  },
  641: {
    dexNumber: { nat: 641 },
    dexName: "Tornadus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying], moves: [] },
      "form-therian-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.flying], moves: [] },
    },
  },
  642: {
    dexNumber: { nat: 642 },
    dexName: "Thundurus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
      "form-therian-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
    },
  },
  643: {
    dexNumber: { nat: 643 },
    dexName: "Reshiram",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.fire], moves: [] },
    },
  },
  644: {
    dexNumber: { nat: 644 },
    dexName: "Zekrom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.electric], moves: [] },
    },
  },
  645: {
    dexNumber: { nat: 645 },
    dexName: "Landorus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.flying], moves: [] },
      "form-therian-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.flying], moves: [] },
    },
  },
  646: {
    dexNumber: { nat: 646 },
    dexName: "Kyurem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
      "form-white-kyurem": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
      "form-black-kyurem": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
    },
  },
  647: {
    dexNumber: { nat: 647 },
    dexName: "Keldeo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fighting], moves: [] },
      "form-resolute-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fighting], moves: [] },
    },
  },
  648: {
    dexNumber: { nat: 648 },
    dexName: "Meloetta",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.psychic], moves: [] },
      "form-pirouette-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fighting], moves: [] },
    },
  },
  649: {
    dexNumber: { nat: 649 },
    dexName: "Genesect",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.steel], moves: [] },
    },
  },
  650: {
    dexNumber: { nat: 650 },
    dexName: "Chespin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  651: {
    dexNumber: { nat: 651 },
    dexName: "Quilladin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  652: {
    dexNumber: { nat: 652 },
    dexName: "Chesnaught",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fighting], moves: [] },
    },
  },
  653: {
    dexNumber: { nat: 653 },
    dexName: "Fennekin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  654: {
    dexNumber: { nat: 654 },
    dexName: "Braixen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  655: {
    dexNumber: { nat: 655 },
    dexName: "Delphox",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.psychic], moves: [] },
    },
  },
  656: {
    dexNumber: { nat: 656 },
    dexName: "Froakie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  657: {
    dexNumber: { nat: 657 },
    dexName: "Frogadier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  658: {
    dexNumber: { nat: 658 },
    dexName: "Greninja",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
      "form-ash-greninja": { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dark], moves: [] },
    },
  },
  659: {
    dexNumber: { nat: 659 },
    dexName: "Bunnelby",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  660: {
    dexNumber: { nat: 660 },
    dexName: "Diggersby",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.ground], moves: [] },
    },
  },
  661: {
    dexNumber: { nat: 661 },
    dexName: "Fletchling",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  662: {
    dexNumber: { nat: 662 },
    dexName: "Fletchinder",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
    },
  },
  663: {
    dexNumber: { nat: 663 },
    dexName: "Talonflame",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
    },
  },
  664: {
    dexNumber: { nat: 664 },
    dexName: "Scatterbug",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  665: {
    dexNumber: { nat: 665 },
    dexName: "Spewpa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  666: {
    dexNumber: { nat: 666 },
    dexName: "Vivillon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.flying], moves: [] },
    },
  },
  667: {
    dexNumber: { nat: 667 },
    dexName: "Litleo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.normal], moves: [] },
    },
  },
  668: {
    dexNumber: { nat: 668 },
    dexName: "Pyroar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.normal], moves: [] },
    },
  },
  669: {
    dexNumber: { nat: 669 },
    dexName: "Flabébé",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  670: {
    dexNumber: { nat: 670 },
    dexName: "Floette",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  671: {
    dexNumber: { nat: 671 },
    dexName: "Florges",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  672: {
    dexNumber: { nat: 672 },
    dexName: "Skiddo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  673: {
    dexNumber: { nat: 673 },
    dexName: "Gogoat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  674: {
    dexNumber: { nat: 674 },
    dexName: "Pancham",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  675: {
    dexNumber: { nat: 675 },
    dexName: "Pangoro",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.dark], moves: [] },
    },
  },
  676: {
    dexNumber: { nat: 676 },
    dexName: "Furfrou",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  677: {
    dexNumber: { nat: 677 },
    dexName: "Espurr",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  678: {
    dexNumber: { nat: 678 },
    dexName: "Meowstic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      [FORM_IDS.female]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  679: {
    dexNumber: { nat: 679 },
    dexName: "Honedge",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ghost], moves: [] },
    },
  },
  680: {
    dexNumber: { nat: 680 },
    dexName: "Doublade",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ghost], moves: [] },
    },
  },
  681: {
    dexNumber: { nat: 681 },
    dexName: "Aegislash",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-blade-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ghost], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ghost], moves: [] },
    },
  },
  682: {
    dexNumber: { nat: 682 },
    dexName: "Spritzee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  683: {
    dexNumber: { nat: 683 },
    dexName: "Aromatisse",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  684: {
    dexNumber: { nat: 684 },
    dexName: "Swirlix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  685: {
    dexNumber: { nat: 685 },
    dexName: "Slurpuff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  686: {
    dexNumber: { nat: 686 },
    dexName: "Inkay",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.psychic], moves: [] },
    },
  },
  687: {
    dexNumber: { nat: 687 },
    dexName: "Malamar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.psychic], moves: [] },
      "form-mega-malamar": { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.psychic], moves: [] },
    },
  },
  688: {
    dexNumber: { nat: 688 },
    dexName: "Binacle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  689: {
    dexNumber: { nat: 689 },
    dexName: "Barbaracle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.water], moves: [] },
    },
  },
  690: {
    dexNumber: { nat: 690 },
    dexName: "Skrelp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.water], moves: [] },
    },
  },
  691: {
    dexNumber: { nat: 691 },
    dexName: "Dragalge",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dragon], moves: [] },
    },
  },
  692: {
    dexNumber: { nat: 692 },
    dexName: "Clauncher",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  693: {
    dexNumber: { nat: 693 },
    dexName: "Clawitzer",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  694: {
    dexNumber: { nat: 694 },
    dexName: "Helioptile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.normal], moves: [] },
    },
  },
  695: {
    dexNumber: { nat: 695 },
    dexName: "Heliolisk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.normal], moves: [] },
    },
  },
  696: {
    dexNumber: { nat: 696 },
    dexName: "Tyrunt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.dragon], moves: [] },
    },
  },
  697: {
    dexNumber: { nat: 697 },
    dexName: "Tyrantrum",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.dragon], moves: [] },
    },
  },
  698: {
    dexNumber: { nat: 698 },
    dexName: "Amaura",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.ice], moves: [] },
    },
  },
  699: {
    dexNumber: { nat: 699 },
    dexName: "Aurorus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 198,
        attack: 97,
        defense: 92,
        spAtk: 119,
        spDef: 112,
        speed: 78,
        types: [TYPES.rock, TYPES.ice],
        moves: [
          MOVES.gigaImpact,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.hyperBeam,
          MOVES.hyperVoice,
          MOVES.round,
          MOVES.weatherBall,
          MOVES.snore,
          MOVES.encore,
          MOVES.safeguard,
          MOVES.sleepTalk,
          MOVES.attract,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.chillingWater,
          MOVES.rainDance,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.discharge,
          MOVES.thunderWave,
          MOVES.stoneEdge,
          MOVES.rockSlide,
          MOVES.rockTomb,
          MOVES.rockBlast,
          MOVES.meteorBeam,
          MOVES.ancientPower,
          MOVES.stealthRock,
          MOVES.sandstorm,
          MOVES.earthquake,
          MOVES.bulldoze,
          MOVES.earthPower,
          MOVES.mudShot,
          MOVES.iceSpinner,
          MOVES.avalanche,
          MOVES.icicleSpear,
          MOVES.blizzard,
          MOVES.iceBeam,
          MOVES.freezeDry,
          MOVES.icyWind,
          MOVES.snowscape,
          MOVES.auroraVeil,
          MOVES.haze,
          MOVES.zenHeadbutt,
          MOVES.psychic,
          MOVES.mirrorCoat,
          MOVES.calmMind,
          MOVES.rest,
          MOVES.lightScreen,
          MOVES.outrage,
          MOVES.darkPulse,
          MOVES.ironTail,
          MOVES.ironHead,
          MOVES.flashCannon,
          MOVES.ironDefense
        ],
      }
    },
  },
  700: {
    dexNumber: { nat: 700 },
    dexName: "Sylveon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 170,
        attack: 85,
        defense: 85,
        spAtk: 130,
        spDef: 150,
        speed: 80,
        types: [TYPES.fairy],
        moves: [
          MOVES.gigaImpact,
          MOVES.lastResort,
          MOVES.doubleEdge,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.covet,
          MOVES.quickAttack,
          MOVES.flail,
          MOVES.hyperBeam,
          MOVES.hyperVoice,
          MOVES.round,
          MOVES.weatherBall,
          MOVES.snore,
          MOVES.copycat,
          MOVES.tickle,
          MOVES.yawn,
          MOVES.wish,
          MOVES.helpingHand,
          MOVES.psychUp,
          MOVES.batonPass,
          MOVES.safeguard,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.focusEnergy,
          MOVES.roar,
          MOVES.trailblaze,
          MOVES.mysticalFire,
          MOVES.sunnyDay,
          MOVES.rainDance,
          MOVES.dig,
          MOVES.mudSlap,
          MOVES.detect,
          MOVES.psychic,
          MOVES.psyshock,
          MOVES.storedPower,
          MOVES.calmMind,
          MOVES.skillSwap,
          MOVES.rest,
          MOVES.reflect,
          MOVES.lightScreen,
          MOVES.shadowBall,
          MOVES.curse,
          MOVES.bite,
          MOVES.fakeTears,
          MOVES.playRough,
          MOVES.mistyExplosion,
          MOVES.moonblast,
          MOVES.alluringVoice,
          MOVES.dazzlingGleam,
          MOVES.drainingKiss,
          MOVES.babyDollEyes,
          MOVES.mistyTerrain,
          MOVES.charm,
        ],
      }
    },
  },
  701: {
    dexNumber: { nat: 701 },
    dexName: "Hawlucha",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.flying], moves: [] },
      "form-mega-hawlucha": { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.flying], moves: [] },
    },
  },
  702: {
    dexNumber: { nat: 702 },
    dexName: "Dedenne",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.fairy], moves: [] },
    },
  },
  703: {
    dexNumber: { nat: 703 },
    dexName: "Carbink",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fairy], moves: [] },
    },
  },
  704: {
    dexNumber: { nat: 704 },
    dexName: "Goomy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  705: {
    dexNumber: { nat: 705 },
    dexName: "Sliggoo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.dragon], moves: [] },
    },
  },
  706: {
    dexNumber: { nat: 706 },
    dexName: "Goodra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.dragon], moves: [] },
    },
  },
  707: {
    dexNumber: { nat: 707 },
    dexName: "Klefki",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.fairy], moves: [] },
    },
  },
  708: {
    dexNumber: { nat: 708 },
    dexName: "Phantump",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
    },
  },
  709: {
    dexNumber: { nat: 709 },
    dexName: "Trevenant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
    },
  },
  710: {
    dexNumber: { nat: 710 },
    dexName: "Pumpkaboo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.small]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.large]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.jumbo]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
    },
  },
  711: {
    dexNumber: { nat: 711 },
    dexName: "Gourgeist",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.small]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.large]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
      [FORM_IDS.jumbo]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
    },
  },
  712: {
    dexNumber: { nat: 712 },
    dexName: "Bergmite",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  713: {
    dexNumber: { nat: 713 },
    dexName: "Avalugg",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.rock], moves: [] },
    },
  },
  714: {
    dexNumber: { nat: 714 },
    dexName: "Noibat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying, TYPES.dragon], moves: [] },
    },
  },
  715: {
    dexNumber: { nat: 715 },
    dexName: "Noivern",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 160,
        attack: 90,
        defense: 100,
        spAtk: 117,
        spDef: 100,
        speed: 143,
        types: [TYPES.flying, TYPES.dragon],
        moves: [
          MOVES.gigaImpact,
          MOVES.doubleEdge,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.superFang,
          MOVES.hyperBeam,
          MOVES.boomburst,
          MOVES.uproar,
          MOVES.round,
          MOVES.snore,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.scaryFace,
          MOVES.protect,
          MOVES.substitue,
          MOVES.doubleTeam,
          MOVES.screech,
          MOVES.whirlwind,
          MOVES.solarBeam,
          MOVES.heatWave,
          MOVES.flamethrower,
          MOVES.sunnyDay,
          MOVES.waterPulse,
          MOVES.wildCharge,
          MOVES.xScissor,
          MOVES.leechLife,
          MOVES.uTurn,
          MOVES.skyAttack,
          MOVES.fly,
          MOVES.aerialAce,
          MOVES.acrobatics,
          MOVES.dualWingbeat,
          MOVES.hurricane,
          MOVES.airSlash,
          MOVES.airCutter,
          MOVES.defog,
          MOVES.tailwind,
          MOVES.roost,
          MOVES.brickBreak,
          MOVES.focusBlast,
          MOVES.psychic,
          MOVES.psychicNoise,
          MOVES.rest,
          MOVES.agility,
          MOVES.shadowClaw,
          MOVES.shadowBall,
          MOVES.outrage,
          MOVES.dragonRush,
          MOVES.dragonClaw,
          MOVES.breakingSwipe,
          MOVES.dragonTail,
          MOVES.dracoMeteor,
          MOVES.dragonPulse,
          MOVES.dragonCheer,
          MOVES.dragonDance,
          MOVES.thief,
          MOVES.bite,
          MOVES.darkPulse,
          MOVES.switcheroo,
          MOVES.taunt,
          MOVES.ironTail,
          MOVES.steelWing,
          MOVES.moonlight,
        ],
      }
    },
  },
  716: {
    dexNumber: { nat: 716 },
    dexName: "Xerneas",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  717: {
    dexNumber: { nat: 717 },
    dexName: "Yveltal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  718: {
    dexNumber: { nat: 718 },
    dexName: "Zygarde",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-10-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
      "form-complete-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ground], moves: [] },
    },
  },
  719: {
    dexNumber: { nat: 719 },
    dexName: "Diancie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fairy], moves: [] },
      "form-mega-diancie": { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fairy], moves: [] },
    },
  },
  720: {
    dexNumber: { nat: 720 },
    dexName: "Hoopa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-hoopa-unbound": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.dark], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.ghost], moves: [] },
    },
  },
  721: {
    dexNumber: { nat: 721 },
    dexName: "Volcanion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.water], moves: [] },
    },
  },
  722: {
    dexNumber: { nat: 722 },
    dexName: "Rowlet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  723: {
    dexNumber: { nat: 723 },
    dexName: "Dartrix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.flying], moves: [] },
    },
  },
  724: {
    dexNumber: { nat: 724 },
    dexName: "Decidueye",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ghost], moves: [] },
      [FORM_IDS.hisuian]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fighting], moves: [] },
    },
  },
  725: {
    dexNumber: { nat: 725 },
    dexName: "Litten",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  726: {
    dexNumber: { nat: 726 },
    dexName: "Torracat",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  727: {
    dexNumber: { nat: 727 },
    dexName: "Incineroar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.dark], moves: [] },
    },
  },
  728: {
    dexNumber: { nat: 728 },
    dexName: "Popplio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  729: {
    dexNumber: { nat: 729 },
    dexName: "Brionne",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  730: {
    dexNumber: { nat: 730 },
    dexName: "Primarina",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fairy], moves: [] },
    },
  },
  731: {
    dexNumber: { nat: 731 },
    dexName: "Pikipek",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  732: {
    dexNumber: { nat: 732 },
    dexName: "Trumbeak",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  733: {
    dexNumber: { nat: 733 },
    dexName: "Toucannon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  734: {
    dexNumber: { nat: 734 },
    dexName: "Yungoos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  735: {
    dexNumber: { nat: 735 },
    dexName: "Gumshoos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  736: {
    dexNumber: { nat: 736 },
    dexName: "Grubbin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  737: {
    dexNumber: { nat: 737 },
    dexName: "Charjabug",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.electric], moves: [] },
    },
  },
  738: {
    dexNumber: { nat: 738 },
    dexName: "Vikavolt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.electric], moves: [] },
    },
  },
  739: {
    dexNumber: { nat: 739 },
    dexName: "Crabrawler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  740: {
    dexNumber: { nat: 740 },
    dexName: "Crabominable",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.ice], moves: [] },
    },
  },
  741: {
    dexNumber: { nat: 741 },
    dexName: "Oricorio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-pom-pom-style": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
      "form-pau-style": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.flying], moves: [] },
      "form-sensu-style": { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.flying], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.flying], moves: [] },
    },
  },
  742: {
    dexNumber: { nat: 742 },
    dexName: "Cutiefly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fairy], moves: [] },
    },
  },
  743: {
    dexNumber: { nat: 743 },
    dexName: "Ribombee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fairy], moves: [] },
    },
  },
  744: {
    dexNumber: { nat: 744 },
    dexName: "Rockruff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
      "form-own-tempo-rockruff": { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  745: {
    dexNumber: { nat: 745 },
    dexName: "Lycanroc",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
      [FORM_IDS.midnight]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
      [FORM_IDS.dusk]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  746: {
    dexNumber: { nat: 746 },
    dexName: "Wishiwashi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-school-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  747: {
    dexNumber: { nat: 747 },
    dexName: "Mareanie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.water], moves: [] },
    },
  },
  748: {
    dexNumber: { nat: 748 },
    dexName: "Toxapex",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.water], moves: [] },
    },
  },
  749: {
    dexNumber: { nat: 749 },
    dexName: "Mudbray",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  750: {
    dexNumber: { nat: 750 },
    dexName: "Mudsdale",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  751: {
    dexNumber: { nat: 751 },
    dexName: "Dewpider",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.bug], moves: [] },
    },
  },
  752: {
    dexNumber: { nat: 752 },
    dexName: "Araquanid",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.bug], moves: [] },
    },
  },
  753: {
    dexNumber: { nat: 753 },
    dexName: "Fomantis",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  754: {
    dexNumber: { nat: 754 },
    dexName: "Lurantis",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  755: {
    dexNumber: { nat: 755 },
    dexName: "Morelull",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fairy], moves: [] },
    },
  },
  756: {
    dexNumber: { nat: 756 },
    dexName: "Shiinotic",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fairy], moves: [] },
    },
  },
  757: {
    dexNumber: { nat: 757 },
    dexName: "Salandit",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fire], moves: [] },
    },
  },
  758: {
    dexNumber: { nat: 758 },
    dexName: "Salazzle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fire], moves: [] },
    },
  },
  759: {
    dexNumber: { nat: 759 },
    dexName: "Stufful",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fighting], moves: [] },
    },
  },
  760: {
    dexNumber: { nat: 760 },
    dexName: "Bewear",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.fighting], moves: [] },
    },
  },
  761: {
    dexNumber: { nat: 761 },
    dexName: "Bounsweet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  762: {
    dexNumber: { nat: 762 },
    dexName: "Steenee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  763: {
    dexNumber: { nat: 763 },
    dexName: "Tsareena",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  764: {
    dexNumber: { nat: 764 },
    dexName: "Comfey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  765: {
    dexNumber: { nat: 765 },
    dexName: "Oranguru",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.psychic], moves: [] },
    },
  },
  766: {
    dexNumber: { nat: 766 },
    dexName: "Passimian",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  767: {
    dexNumber: { nat: 767 },
    dexName: "Wimpod",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.water], moves: [] },
    },
  },
  768: {
    dexNumber: { nat: 768 },
    dexName: "Golisopod",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.water], moves: [] },
    },
  },
  769: {
    dexNumber: { nat: 769 },
    dexName: "Sandygast",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.ground], moves: [] },
    },
  },
  770: {
    dexNumber: { nat: 770 },
    dexName: "Palossand",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.ground], moves: [] },
    },
  },
  771: {
    dexNumber: { nat: 771 },
    dexName: "Pyukumuku",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  772: {
    dexNumber: { nat: 772 },
    dexName: "Type: Null",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  773: {
    dexNumber: { nat: 773 },
    dexName: "Silvally",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  774: {
    dexNumber: { nat: 774 },
    dexName: "Minior",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-core-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.flying], moves: [] },
    },
  },
  775: {
    dexNumber: { nat: 775 },
    dexName: "Komala",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  776: {
    dexNumber: { nat: 776 },
    dexName: "Turtonator",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.dragon], moves: [] },
    },
  },
  777: {
    dexNumber: { nat: 777 },
    dexName: "Togedemaru",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.steel], moves: [] },
    },
  },
  778: {
    dexNumber: { nat: 778 },
    dexName: "Mimikyu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.fairy], moves: [] },
    },
  },
  779: {
    dexNumber: { nat: 779 },
    dexName: "Bruxish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
    },
  },
  780: {
    dexNumber: { nat: 780 },
    dexName: "Drampa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.dragon], moves: [] },
    },
  },
  781: {
    dexNumber: { nat: 781 },
    dexName: "Dhelmise",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.grass], moves: [] },
    },
  },
  782: {
    dexNumber: { nat: 782 },
    dexName: "Jangmo-o",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  783: {
    dexNumber: { nat: 783 },
    dexName: "Hakamo-o",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.fighting], moves: [] },
    },
  },
  784: {
    dexNumber: { nat: 784 },
    dexName: "Kommo-o",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.fighting], moves: [] },
    },
  },
  785: {
    dexNumber: { nat: 785 },
    dexName: "Tapu Koko",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.fairy], moves: [] },
    },
  },
  786: {
    dexNumber: { nat: 786 },
    dexName: "Tapu Lele",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  787: {
    dexNumber: { nat: 787 },
    dexName: "Tapu Bulu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fairy], moves: [] },
    },
  },
  788: {
    dexNumber: { nat: 788 },
    dexName: "Tapu Fini",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fairy], moves: [] },
    },
  },
  789: {
    dexNumber: { nat: 789 },
    dexName: "Cosmog",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  790: {
    dexNumber: { nat: 790 },
    dexName: "Cosmoem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  791: {
    dexNumber: { nat: 791 },
    dexName: "Solgaleo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.steel], moves: [] },
    },
  },
  792: {
    dexNumber: { nat: 792 },
    dexName: "Lunala",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.ghost], moves: [] },
    },
  },
  793: {
    dexNumber: { nat: 793 },
    dexName: "Nihilego",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.poison], moves: [] },
    },
  },
  794: {
    dexNumber: { nat: 794 },
    dexName: "Buzzwole",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fighting], moves: [] },
    },
  },
  795: {
    dexNumber: { nat: 795 },
    dexName: "Pheromosa",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fighting], moves: [] },
    },
  },
  796: {
    dexNumber: { nat: 796 },
    dexName: "Xurkitree",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  797: {
    dexNumber: { nat: 797 },
    dexName: "Celesteela",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.flying], moves: [] },
    },
  },
  798: {
    dexNumber: { nat: 798 },
    dexName: "Kartana",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.steel], moves: [] },
    },
  },
  799: {
    dexNumber: { nat: 799 },
    dexName: "Guzzlord",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.dragon], moves: [] },
    },
  },
  800: {
    dexNumber: { nat: 800 },
    dexName: "Necrozma",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
      "form-dusk-mane-necrozma": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.steel], moves: [] },
      "form-dawn-wings-necrozma": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.ghost], moves: [] },
      "form-ultra-necrozma": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.dragon], moves: [] },
    },
  },
  801: {
    dexNumber: { nat: 801 },
    dexName: "Magearna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.fairy], moves: [] },
    },
  },
  802: {
    dexNumber: { nat: 802 },
    dexName: "Marshadow",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.ghost], moves: [] },
    },
  },
  803: {
    dexNumber: { nat: 803 },
    dexName: "Poipole",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison], moves: [] },
    },
  },
  804: {
    dexNumber: { nat: 804 },
    dexName: "Naganadel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dragon], moves: [] },
    },
  },
  805: {
    dexNumber: { nat: 805 },
    dexName: "Stakataka",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.steel], moves: [] },
    },
  },
  806: {
    dexNumber: { nat: 806 },
    dexName: "Blacephalon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ghost], moves: [] },
    },
  },
  807: {
    dexNumber: { nat: 807 },
    dexName: "Zeraora",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  808: {
    dexNumber: { nat: 808 },
    dexName: "Meltan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  809: {
    dexNumber: { nat: 809 },
    dexName: "Melmetal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  810: {
    dexNumber: { nat: 810 },
    dexName: "Grookey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  811: {
    dexNumber: { nat: 811 },
    dexName: "Thwackey",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  812: {
    dexNumber: { nat: 812 },
    dexName: "Rillaboom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  813: {
    dexNumber: { nat: 813 },
    dexName: "Scorbunny",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  814: {
    dexNumber: { nat: 814 },
    dexName: "Raboot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  815: {
    dexNumber: { nat: 815 },
    dexName: "Cinderace",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  816: {
    dexNumber: { nat: 816 },
    dexName: "Sobble",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  817: {
    dexNumber: { nat: 817 },
    dexName: "Drizzile",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  818: {
    dexNumber: { nat: 818 },
    dexName: "Inteleon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  819: {
    dexNumber: { nat: 819 },
    dexName: "Skwovet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  820: {
    dexNumber: { nat: 820 },
    dexName: "Greedent",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  821: {
    dexNumber: { nat: 821 },
    dexName: "Rookidee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying], moves: [] },
    },
  },
  822: {
    dexNumber: { nat: 822 },
    dexName: "Corvisquire",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying], moves: [] },
    },
  },
  823: {
    dexNumber: { nat: 823 },
    dexName: "Corviknight",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying, TYPES.steel], moves: [] },
    },
  },
  824: {
    dexNumber: { nat: 824 },
    dexName: "Blipbug",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  825: {
    dexNumber: { nat: 825 },
    dexName: "Dottler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.psychic], moves: [] },
    },
  },
  826: {
    dexNumber: { nat: 826 },
    dexName: "Orbeetle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.psychic], moves: [] },
    },
  },
  827: {
    dexNumber: { nat: 827 },
    dexName: "Nickit",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  828: {
    dexNumber: { nat: 828 },
    dexName: "Thievul",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  829: {
    dexNumber: { nat: 829 },
    dexName: "Gossifleur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  830: {
    dexNumber: { nat: 830 },
    dexName: "Eldegoss",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  831: {
    dexNumber: { nat: 831 },
    dexName: "Wooloo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  832: {
    dexNumber: { nat: 832 },
    dexName: "Dubwool",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  833: {
    dexNumber: { nat: 833 },
    dexName: "Chewtle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  834: {
    dexNumber: { nat: 834 },
    dexName: "Drednaw",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.rock], moves: [] },
    },
  },
  835: {
    dexNumber: { nat: 835 },
    dexName: "Yamper",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  836: {
    dexNumber: { nat: 836 },
    dexName: "Boltund",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  837: {
    dexNumber: { nat: 837 },
    dexName: "Rolycoly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  838: {
    dexNumber: { nat: 838 },
    dexName: "Carkol",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fire], moves: [] },
    },
  },
  839: {
    dexNumber: { nat: 839 },
    dexName: "Coalossal",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.fire], moves: [] },
    },
  },
  840: {
    dexNumber: { nat: 840 },
    dexName: "Applin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  841: {
    dexNumber: { nat: 841 },
    dexName: "Flapple",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  842: {
    dexNumber: { nat: 842 },
    dexName: "Appletun",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  843: {
    dexNumber: { nat: 843 },
    dexName: "Silicobra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  844: {
    dexNumber: { nat: 844 },
    dexName: "Sandaconda",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground], moves: [] },
    },
  },
  845: {
    dexNumber: { nat: 845 },
    dexName: "Cramorant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying, TYPES.water], moves: [] },
    },
  },
  846: {
    dexNumber: { nat: 846 },
    dexName: "Arrokuda",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  847: {
    dexNumber: { nat: 847 },
    dexName: "Barraskewda",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  848: {
    dexNumber: { nat: 848 },
    dexName: "Toxel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.poison], moves: [] },
    },
  },
  849: {
    dexNumber: { nat: 849 },
    dexName: "Toxtricity",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-low-key-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.poison], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.poison], moves: [] },
    },
  },
  850: {
    dexNumber: { nat: 850 },
    dexName: "Sizzlipede",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.bug], moves: [] },
    },
  },
  851: {
    dexNumber: { nat: 851 },
    dexName: "Centiskorch",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.bug], moves: [] },
    },
  },
  852: {
    dexNumber: { nat: 852 },
    dexName: "Clobbopus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  853: {
    dexNumber: { nat: 853 },
    dexName: "Grapploct",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  854: {
    dexNumber: { nat: 854 },
    dexName: "Sinistea",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  855: {
    dexNumber: { nat: 855 },
    dexName: "Polteageist",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  856: {
    dexNumber: { nat: 856 },
    dexName: "Hatenna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  857: {
    dexNumber: { nat: 857 },
    dexName: "Hattrem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  858: {
    dexNumber: { nat: 858 },
    dexName: "Hatterene",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.fairy], moves: [] },
    },
  },
  859: {
    dexNumber: { nat: 859 },
    dexName: "Impidimp",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fairy], moves: [] },
    },
  },
  860: {
    dexNumber: { nat: 860 },
    dexName: "Morgrem",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fairy], moves: [] },
    },
  },
  861: {
    dexNumber: { nat: 861 },
    dexName: "Grimmsnarl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fairy], moves: [] },
    },
  },
  862: {
    dexNumber: { nat: 862 },
    dexName: "Obstagoon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.normal], moves: [] },
    },
  },
  863: {
    dexNumber: { nat: 863 },
    dexName: "Perrserker",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  864: {
    dexNumber: { nat: 864 },
    dexName: "Cursola",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  865: {
    dexNumber: { nat: 865 },
    dexName: "Sirfetch'd",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  866: {
    dexNumber: { nat: 866 },
    dexName: "Mr. Rime",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.psychic], moves: [] },
    },
  },
  867: {
    dexNumber: { nat: 867 },
    dexName: "Runerigus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.ghost], moves: [] },
    },
  },
  868: {
    dexNumber: { nat: 868 },
    dexName: "Milcery",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  869: {
    dexNumber: { nat: 869 },
    dexName: "Alcremie",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  870: {
    dexNumber: { nat: 870 },
    dexName: "Falinks",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  871: {
    dexNumber: { nat: 871 },
    dexName: "Pincurchin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  872: {
    dexNumber: { nat: 872 },
    dexName: "Snom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.bug], moves: [] },
    },
  },
  873: {
    dexNumber: { nat: 873 },
    dexName: "Frosmoth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.bug], moves: [] },
    },
  },
  874: {
    dexNumber: { nat: 874 },
    dexName: "Stonjourner",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  875: {
    dexNumber: { nat: 875 },
    dexName: "Eiscue",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-noice-face": { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  876: {
    dexNumber: { nat: 876 },
    dexName: "Indeedee",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.normal], moves: [] },
      [FORM_IDS.female]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.normal], moves: [] },
    },
  },
  877: {
    dexNumber: { nat: 877 },
    dexName: "Morpeko",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-hangry-mode": { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.dark], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.dark], moves: [] },
    },
  },
  878: {
    dexNumber: { nat: 878 },
    dexName: "Cufant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  879: {
    dexNumber: { nat: 879 },
    dexName: "Copperajah",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  880: {
    dexNumber: { nat: 880 },
    dexName: "Dracozolt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.dragon], moves: [] },
    },
  },
  881: {
    dexNumber: { nat: 881 },
    dexName: "Arctozolt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.ice], moves: [] },
    },
  },
  882: {
    dexNumber: { nat: 882 },
    dexName: "Dracovish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dragon], moves: [] },
    },
  },
  883: {
    dexNumber: { nat: 883 },
    dexName: "Arctovish",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ice], moves: [] },
    },
  },
  884: {
    dexNumber: { nat: 884 },
    dexName: "Duraludon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.dragon], moves: [] },
    },
  },
  885: {
    dexNumber: { nat: 885 },
    dexName: "Dreepy",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ghost], moves: [] },
    },
  },
  886: {
    dexNumber: { nat: 886 },
    dexName: "Drakloak",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ghost], moves: [] },
    },
  },
  887: {
    dexNumber: { nat: 887 },
    dexName: "Dragapult",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ghost], moves: [] },
    },
  },
  888: {
    dexNumber: { nat: 888 },
    dexName: "Zacian",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-crowned-sword": { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.steel], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  889: {
    dexNumber: { nat: 889 },
    dexName: "Zamazenta",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-crowned-shield": { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.steel], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  890: {
    dexNumber: { nat: 890 },
    dexName: "Eternatus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dragon], moves: [] },
      "form-eternamax": { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.dragon], moves: [] },
    },
  },
  891: {
    dexNumber: { nat: 891 },
    dexName: "Kubfu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting], moves: [] },
    },
  },
  892: {
    dexNumber: { nat: 892 },
    dexName: "Urshifu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-rapid-strike-style": { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.water], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.dark], moves: [] },
    },
  },
  893: {
    dexNumber: { nat: 893 },
    dexName: "Zarude",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.grass], moves: [] },
    },
  },
  894: {
    dexNumber: { nat: 894 },
    dexName: "Regieleki",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  895: {
    dexNumber: { nat: 895 },
    dexName: "Regidrago",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon], moves: [] },
    },
  },
  896: {
    dexNumber: { nat: 896 },
    dexName: "Glastrier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  897: {
    dexNumber: { nat: 897 },
    dexName: "Spectrier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  898: {
    dexNumber: { nat: 898 },
    dexName: "Calyrex",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.grass], moves: [] },
      "form-ice-rider": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.ice], moves: [] },
      "form-shadow-rider": { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic, TYPES.ghost], moves: [] },
    },
  },
  899: {
    dexNumber: { nat: 899 },
    dexName: "Wyrdeer",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.psychic], moves: [] },
    },
  },
  900: {
    dexNumber: { nat: 900 },
    dexName: "Kleavor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.rock], moves: [] },
    },
  },
  901: {
    dexNumber: { nat: 901 },
    dexName: "Ursaluna",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.normal], moves: [] },
      "form-bloodmoon": { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.normal], moves: [] },
    },
  },
  902: {
    dexNumber: { nat: 902 },
    dexName: "Basculegion",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ghost], moves: [] },
      [FORM_IDS.female]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.ghost], moves: [] },
    },
  },
  903: {
    dexNumber: { nat: 903 },
    dexName: "Sneasler",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.poison], moves: [] },
    },
  },
  904: {
    dexNumber: { nat: 904 },
    dexName: "Overqwil",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.poison], moves: [] },
    },
  },
  905: {
    dexNumber: { nat: 905 },
    dexName: "Enamorus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.flying], moves: [] },
      "form-therian-forme": { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.flying], moves: [] },
    },
  },
  906: {
    dexNumber: { nat: 906 },
    dexName: "Sprigatito",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  907: {
    dexNumber: { nat: 907 },
    dexName: "Floragato",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  908: {
    dexNumber: { nat: 908 },
    dexName: "Meowscarada",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dark], moves: [] },
    },
  },
  909: {
    dexNumber: { nat: 909 },
    dexName: "Fuecoco",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  910: {
    dexNumber: { nat: 910 },
    dexName: "Crocalor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  911: {
    dexNumber: { nat: 911 },
    dexName: "Skeledirge",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.ghost], moves: [] },
    },
  },
  912: {
    dexNumber: { nat: 912 },
    dexName: "Quaxly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  913: {
    dexNumber: { nat: 913 },
    dexName: "Quaxwell",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  914: {
    dexNumber: { nat: 914 },
    dexName: "Quaquaval",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.fighting], moves: [] },
    },
  },
  915: {
    dexNumber: { nat: 915 },
    dexName: "Lechonk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  916: {
    dexNumber: { nat: 916 },
    dexName: "Oinkologne",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.female]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  917: {
    dexNumber: { nat: 917 },
    dexName: "Tarountula",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  918: {
    dexNumber: { nat: 918 },
    dexName: "Spidops",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  919: {
    dexNumber: { nat: 919 },
    dexName: "Nymble",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  920: {
    dexNumber: { nat: 920 },
    dexName: "Lokix",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.dark], moves: [] },
    },
  },
  921: {
    dexNumber: { nat: 921 },
    dexName: "Pawmi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  922: {
    dexNumber: { nat: 922 },
    dexName: "Pawmo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.fighting], moves: [] },
    },
  },
  923: {
    dexNumber: { nat: 923 },
    dexName: "Pawmot",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.fighting], moves: [] },
    },
  },
  924: {
    dexNumber: { nat: 924 },
    dexName: "Tandemaus",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  925: {
    dexNumber: { nat: 925 },
    dexName: "Maushold",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-family-of-three": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  926: {
    dexNumber: { nat: 926 },
    dexName: "Fidough",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  927: {
    dexNumber: { nat: 927 },
    dexName: "Dachsbun",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy], moves: [] },
    },
  },
  928: {
    dexNumber: { nat: 928 },
    dexName: "Smoliv",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.normal], moves: [] },
    },
  },
  929: {
    dexNumber: { nat: 929 },
    dexName: "Dolliv",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.normal], moves: [] },
    },
  },
  930: {
    dexNumber: { nat: 930 },
    dexName: "Arboliva",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.normal], moves: [] },
    },
  },
  931: {
    dexNumber: { nat: 931 },
    dexName: "Squawkabilly",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-blue-plumage": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      "form-yellow-plumage": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      "form-white-plumage": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.flying], moves: [] },
    },
  },
  932: {
    dexNumber: { nat: 932 },
    dexName: "Nacli",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  933: {
    dexNumber: { nat: 933 },
    dexName: "Naclstack",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  934: {
    dexNumber: { nat: 934 },
    dexName: "Garganacl",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  935: {
    dexNumber: { nat: 935 },
    dexName: "Charcadet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire], moves: [] },
    },
  },
  936: {
    dexNumber: { nat: 936 },
    dexName: "Armarouge",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.psychic], moves: [] },
    },
  },
  937: {
    dexNumber: { nat: 937 },
    dexName: "Ceruledge",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 150,
        attack: 145,
        defense: 100,
        spAtk: 80,
        spDef: 120,
        speed: 105,
        types: [TYPES.fire, TYPES.ghost],
        moves: [
          MOVES.gigaImpact,
          MOVES.facade,
          MOVES.helpingHand,
          MOVES.psychUp,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.protect,
          MOVES.substitue,
          MOVES.disable,
          MOVES.swordsDance,
          MOVES.solarBlade,
          MOVES.flareBlitz,
          MOVES.bitterBlade,
          MOVES.flameCharge,
          MOVES.burnUp,
          MOVES.overheat,
          MOVES.fireBlast,
          MOVES.heatWave,
          MOVES.flamethrower,
          MOVES.lavaPlume,
          MOVES.fireSpin,
          MOVES.willOWisp,
          MOVES.sunnyDay,
          MOVES.xScissor,
          MOVES.poisonJab,
          MOVES.clearSmog,
          MOVES.closeCombat,
          MOVES.brickBreak,
          MOVES.vacuumWave,
          MOVES.quickGuard,
          MOVES.bulkUp,
          MOVES.psychoCut,
          MOVES.storedPower,
          MOVES.allySwitch,
          MOVES.rest,
          MOVES.reflect,
          MOVES.lightScreen,
          MOVES.poltergeist,
          MOVES.phantomForce,
          MOVES.shadowClaw,
          MOVES.shadowSneak,
          MOVES.shadowBall,
          MOVES.hex,
          MOVES.nightShade,
          MOVES.destinyBond,
          MOVES.spite,
          MOVES.curse,
          MOVES.confuseRay,
          MOVES.dragonClaw,
          MOVES.throatChop,
          MOVES.nightSlash,
          MOVES.fling,
          MOVES.taunt,
          MOVES.ironHead,
          MOVES.ironDefense,
        ],
      },
    },
  },
  938: {
    dexNumber: { nat: 938 },
    dexName: "Tadbulb",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  939: {
    dexNumber: { nat: 939 },
    dexName: "Bellibolt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric], moves: [] },
    },
  },
  940: {
    dexNumber: { nat: 940 },
    dexName: "Wattrel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
    },
  },
  941: {
    dexNumber: { nat: 941 },
    dexName: "Kilowattrel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.flying], moves: [] },
    },
  },
  942: {
    dexNumber: { nat: 942 },
    dexName: "Maschiff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  943: {
    dexNumber: { nat: 943 },
    dexName: "Mabosstiff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark], moves: [] },
    },
  },
  944: {
    dexNumber: { nat: 944 },
    dexName: "Shroodle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.normal], moves: [] },
    },
  },
  945: {
    dexNumber: { nat: 945 },
    dexName: "Grafaiai",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.normal], moves: [] },
    },
  },
  946: {
    dexNumber: { nat: 946 },
    dexName: "Bramblin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ghost], moves: [] },
    },
  },
  947: {
    dexNumber: { nat: 947 },
    dexName: "Brambleghast",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ghost], moves: [] },
    },
  },
  948: {
    dexNumber: { nat: 948 },
    dexName: "Toedscool",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.grass], moves: [] },
    },
  },
  949: {
    dexNumber: { nat: 949 },
    dexName: "Toedscruel",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.grass], moves: [] },
    },
  },
  950: {
    dexNumber: { nat: 950 },
    dexName: "Klawf",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock], moves: [] },
    },
  },
  951: {
    dexNumber: { nat: 951 },
    dexName: "Capsakid",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  952: {
    dexNumber: { nat: 952 },
    dexName: "Scovillain",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fire], moves: [] },
    },
  },
  953: {
    dexNumber: { nat: 953 },
    dexName: "Rellor",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug], moves: [] },
    },
  },
  954: {
    dexNumber: { nat: 954 },
    dexName: "Rabsca",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.psychic], moves: [] },
    },
  },
  955: {
    dexNumber: { nat: 955 },
    dexName: "Flittle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  956: {
    dexNumber: { nat: 956 },
    dexName: "Espathra",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.psychic], moves: [] },
    },
  },
  957: {
    dexNumber: { nat: 957 },
    dexName: "Tinkatink",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.steel], moves: [] },
    },
  },
  958: {
    dexNumber: { nat: 958 },
    dexName: "Tinkatuff",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.steel], moves: [] },
    },
  },
  959: {
    dexNumber: { nat: 959 },
    dexName: "Tinkaton",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.steel], moves: [] },
    },
  },
  960: {
    dexNumber: { nat: 960 },
    dexName: "Wiglett",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  961: {
    dexNumber: { nat: 961 },
    dexName: "Wugtrio",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  962: {
    dexNumber: { nat: 962 },
    dexName: "Bombirdier",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying, TYPES.dark], moves: [] },
    },
  },
  963: {
    dexNumber: { nat: 963 },
    dexName: "Finizen",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  964: {
    dexNumber: { nat: 964 },
    dexName: "Palafin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-hero-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  965: {
    dexNumber: { nat: 965 },
    dexName: "Varoom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.poison], moves: [] },
    },
  },
  966: {
    dexNumber: { nat: 966 },
    dexName: "Revavroom",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.poison], moves: [] },
    },
  },
  967: {
    dexNumber: { nat: 967 },
    dexName: "Cyclizar",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.normal], moves: [] },
    },
  },
  968: {
    dexNumber: { nat: 968 },
    dexName: "Orthworm",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel], moves: [] },
    },
  },
  969: {
    dexNumber: { nat: 969 },
    dexName: "Glimmet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.poison], moves: [] },
    },
  },
  970: {
    dexNumber: { nat: 970 },
    dexName: "Glimmora",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.poison], moves: [] },
    },
  },
  971: {
    dexNumber: { nat: 971 },
    dexName: "Greavard",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  972: {
    dexNumber: { nat: 972 },
    dexName: "Houndstone",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  973: {
    dexNumber: { nat: 973 },
    dexName: "Flamigo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.flying, TYPES.fighting], moves: [] },
    },
  },
  974: {
    dexNumber: { nat: 974 },
    dexName: "Cetoddle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  975: {
    dexNumber: { nat: 975 },
    dexName: "Cetitan",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice], moves: [] },
    },
  },
  976: {
    dexNumber: { nat: 976 },
    dexName: "Veluza",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.psychic], moves: [] },
    },
  },
  977: {
    dexNumber: { nat: 977 },
    dexName: "Dondozo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water], moves: [] },
    },
  },
  978: {
    dexNumber: { nat: 978 },
    dexName: "Tatsugiri",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-droopy-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.water], moves: [] },
      "form-stretchy-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.water], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.water], moves: [] },
    },
  },
  979: {
    dexNumber: { nat: 979 },
    dexName: "Annihilape",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.ghost], moves: [] },
    },
  },
  980: {
    dexNumber: { nat: 980 },
    dexName: "Clodsire",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.ground], moves: [] },
    },
  },
  981: {
    dexNumber: { nat: 981 },
    dexName: "Farigiraf",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal, TYPES.psychic], moves: [] },
    },
  },
  982: {
    dexNumber: { nat: 982 },
    dexName: "Dudunsparce",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-three-segment-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  983: {
    dexNumber: { nat: 983 },
    dexName: "Kingambit",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.steel], moves: [] },
    },
  },
  984: {
    dexNumber: { nat: 984 },
    dexName: "Great Tusk",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.fighting], moves: [] },
    },
  },
  985: {
    dexNumber: { nat: 985 },
    dexName: "Scream Tail",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.psychic], moves: [] },
    },
  },
  986: {
    dexNumber: { nat: 986 },
    dexName: "Brute Bonnet",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dark], moves: [] },
    },
  },
  987: {
    dexNumber: { nat: 987 },
    dexName: "Flutter Mane",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost, TYPES.fairy], moves: [] },
    },
  },
  988: {
    dexNumber: { nat: 988 },
    dexName: "Slither Wing",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.bug, TYPES.fighting], moves: [] },
    },
  },
  989: {
    dexNumber: { nat: 989 },
    dexName: "Sandy Shocks",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.ground], moves: [] },
    },
  },
  990: {
    dexNumber: { nat: 990 },
    dexName: "Iron Treads",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ground, TYPES.steel], moves: [] },
    },
  },
  991: {
    dexNumber: { nat: 991 },
    dexName: "Iron Bundle",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ice, TYPES.water], moves: [] },
    },
  },
  992: {
    dexNumber: { nat: 992 },
    dexName: "Iron Hands",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.electric], moves: [] },
    },
  },
  993: {
    dexNumber: { nat: 993 },
    dexName: "Iron Jugulis",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.flying], moves: [] },
    },
  },
  994: {
    dexNumber: { nat: 994 },
    dexName: "Iron Moth",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.poison], moves: [] },
    },
  },
  995: {
    dexNumber: { nat: 995 },
    dexName: "Iron Thorns",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.electric], moves: [] },
    },
  },
  996: {
    dexNumber: { nat: 996 },
    dexName: "Frigibax",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
    },
  },
  997: {
    dexNumber: { nat: 997 },
    dexName: "Arctibax",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
    },
  },
  998: {
    dexNumber: { nat: 998 },
    dexName: "Baxcalibur",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.ice], moves: [] },
    },
  },
  999: {
    dexNumber: { nat: 999 },
    dexName: "Gimmighoul",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-roaming-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.ghost], moves: [] },
    },
  },
  1000: {
    dexNumber: { nat: 1000 },
    dexName: "Gholdengo",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.ghost], moves: [] },
    },
  },
  1001: {
    dexNumber: { nat: 1001 },
    dexName: "Wo-Chien",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.grass], moves: [] },
    },
  },
  1002: {
    dexNumber: { nat: 1002 },
    dexName: "Chien-Pao",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ice], moves: [] },
    },
  },
  1003: {
    dexNumber: { nat: 1003 },
    dexName: "Ting-Lu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.ground], moves: [] },
    },
  },
  1004: {
    dexNumber: { nat: 1004 },
    dexName: "Chi-Yu",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dark, TYPES.fire], moves: [] },
    },
  },
  1005: {
    dexNumber: { nat: 1005 },
    dexName: "Roaring Moon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.dragon, TYPES.dark], moves: [] },
    },
  },
  1006: {
    dexNumber: { nat: 1006 },
    dexName: "Iron Valiant",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fairy, TYPES.fighting], moves: [] },
    },
  },
  1007: {
    dexNumber: { nat: 1007 },
    dexName: "Koraidon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fighting, TYPES.dragon], moves: [] },
    },
  },
  1008: {
    dexNumber: { nat: 1008 },
    dexName: "Miraidon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.dragon], moves: [] },
    },
  },
  1009: {
    dexNumber: { nat: 1009 },
    dexName: "Walking Wake",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.water, TYPES.dragon], moves: [] },
    },
  },
  1010: {
    dexNumber: { nat: 1010 },
    dexName: "Iron Leaves",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.psychic], moves: [] },
    },
  },
  1011: {
    dexNumber: { nat: 1011 },
    dexName: "Dipplin",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  1012: {
    dexNumber: { nat: 1012 },
    dexName: "Poltchageist",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ghost], moves: [] },
    },
  },
  1013: {
    dexNumber: { nat: 1013 },
    dexName: "Sinistcha",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.ghost], moves: [] },
    },
  },
  1014: {
    dexNumber: { nat: 1014 },
    dexName: "Okidogi",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fighting], moves: [] },
    },
  },
  1015: {
    dexNumber: { nat: 1015 },
    dexName: "Munkidori",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.psychic], moves: [] },
    },
  },
  1016: {
    dexNumber: { nat: 1016 },
    dexName: "Fezandipiti",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.fairy], moves: [] },
    },
  },
  1017: {
    dexNumber: { nat: 1017 },
    dexName: "Ogerpon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      "form-wellspring-mask": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.water], moves: [] },
      "form-hearthflame-mask": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.fire], moves: [] },
      "form-cornerstone-mask": { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.rock], moves: [] },
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass], moves: [] },
    },
  },
  1018: {
    dexNumber: { nat: 1018 },
    dexName: "Archaludon",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: {
        hp: 165,
        attack: 125,
        defense: 150,
        spAtk: 145,
        spDef: 85,
        speed: 105,
        types: [TYPES.steel, TYPES.dragon],
        moves: [
          MOVES.gigaImpact,
          MOVES.doubleEdge,
          MOVES.bodySlam,
          MOVES.facade,
          MOVES.hyperBeam,
          MOVES.sleepTalk,
          MOVES.endure,
          MOVES.scaryFace,
          MOVES.protect,
          MOVES.substitue,
          MOVES.focusEnergy,
          MOVES.roar,
          MOVES.swordsDance,
          MOVES.solarBeam,
          MOVES.electroShot,
          MOVES.thunder,
          MOVES.thunderbolt,
          MOVES.thunderWave,
          MOVES.stoneEdge,
          MOVES.rockSlide,
          MOVES.rockTomb,
          MOVES.smackDown,
          MOVES.meteorBeam,
          MOVES.stealthRock,
          MOVES.earthquake,
          MOVES.brickBreak,
          MOVES.auraSphere,
          MOVES.mirrorCoat,
          MOVES.rest,
          MOVES.reflect,
          MOVES.lightScreen,
          MOVES.outrage,
          MOVES.dragonClaw,
          MOVES.breakingSwipe,
          MOVES.dragonTail,
          MOVES.dracoMeteor,
          MOVES.dragonPulse,
          MOVES.dragonCheer,
          MOVES.foulPlay,
          MOVES.nightSlash,
          MOVES.darkPulse,
          MOVES.snarl,
          MOVES.ironHead,
          MOVES.hardPress,
          MOVES.heavySlam,
          MOVES.metalBurst,
          MOVES.gyroBall,
          MOVES.steelBeam,
          MOVES.flashCannon,
          MOVES.ironDefense,
          MOVES.metalSound,
        ]
      },
    },
  },
  1019: {
    dexNumber: { nat: 1019 },
    dexName: "Hydrapple",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.grass, TYPES.dragon], moves: [] },
    },
  },
  1020: {
    dexNumber: { nat: 1020 },
    dexName: "Gouging Fire",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.fire, TYPES.dragon], moves: [] },
    },
  },
  1021: {
    dexNumber: { nat: 1021 },
    dexName: "Raging Bolt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.electric, TYPES.dragon], moves: [] },
    },
  },
  1022: {
    dexNumber: { nat: 1022 },
    dexName: "Iron Boulder",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.rock, TYPES.psychic], moves: [] },
    },
  },
  1023: {
    dexNumber: { nat: 1023 },
    dexName: "Iron Crown",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.steel, TYPES.psychic], moves: [] },
    },
  },
  1024: {
    dexNumber: { nat: 1024 },
    dexName: "Terapagos",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-terastal-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
      "form-stellar-form": { ...DEX_FORM_STATS_TODO, types: [TYPES.normal], moves: [] },
    },
  },
  1025: {
    dexNumber: { nat: 1025 },
    dexName: "Pecharunt",
    games: { [GAME_IDS.CHAMPIONS]: true },
    forms: {
      [FORM_IDS.base]: { ...DEX_FORM_STATS_TODO, types: [TYPES.poison, TYPES.ghost], moves: [] },
    },
  },};

export function getDexIds(): number[] {
  return Object.keys(dexObject)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}
