import type { Direction } from "./types/common"
import type { Resources } from "./types/common"

// general

export const DIRECTION_NORTH: Direction = {
  name: 'N',
  offset: { x: 0, y: 1 }
}
export const DIRECTION_EAST: Direction = {
  name: 'E',
  offset: { x: 1, y: 0 }
}
export const DIRECTION_SOUTH: Direction = {
  name: 'S',
  offset: { x: 0, y: -1 }
}
export const DIRECTION_WEST: Direction = {
  name: 'W',
  offset: { x: -1, y: 0 }
}

export const CRYSTAL_PATCH_INIT_CRYSTALS = 40_000
export const GAS_VENT_INIT_GAS = 40_000
export const RESOURCE_INIT_HP = 100_000

// player

export const PLAYER_MAX_RESOURCE_CRYSTALS = 20_000
export const PLAYER_MAX_RESOURCE_GAS = 20_000

export const PLAYER_INIT_RESOURCE_CRYSTALS = 1_000
export const PLAYER_INIT_RESOURCE_GAS = 0

// unit

export const UNIT_MIN_ATTACK_ACCURACY = 1 // pct
export const UNIT_MAX_ATTACK_ACCURACY = 100 // pct

// builder

export const BUILDER_TRAINING_COST: Resources = { crystals: 200, gas: 0 }

export const BUILDER_INIT_HP = 100

export const BUILDER_INIT_MOVEMENT_SPEED = 1 // TODO map grid spaces?
export const BUILDER_INIT_BUILD_SPEED = 5 // structure HP
export const BUILDER_INIT_REPAIR_SPEED = 7 // structure HP
export const BUILDER_INIT_GATHER_SPEED = 5 // TODO what are these units?

export const BUILDER_GATHER_CRYSTALS_AMT = 20
export const BUILDER_GATHER_GAS_AMT = 20

export const BUILDER_INIT_AGGRO_RANGE = 0
export const BUILDER_INIT_ATTACK_ACCURACY = 10 // 1-100 ie hit chance
export const BUILDER_INIT_ATTACK_RANGE = 1 // TODO map grid spaces?
export const BUILDER_INIT_ATTACK_DAMAGE = 1 // structure/unit HP
export const BUILDER_INIT_ATTACK_DAMAGE_RADIUS = 1 // TODO map grid spaces?

// fighter

// grunt

export const GRUNT_TRAINING_COST: Resources = { crystals: 300, gas: 0 }

export const GRUNT_INIT_HP = 200

export const GRUNT_INIT_MOVEMENT_SPEED = 10

export const GRUNT_INIT_AGGRO_RANGE = 5
export const GRUNT_INIT_ATTACK_ACCURACY = 50
export const GRUNT_INIT_ATTACK_RANGE = 2
export const GRUNT_INIT_ATTACK_DAMAGE = 3
export const GRUNT_INIT_ATTACK_DAMAGE_RADIUS = 1

// soldier

export const SOLDIER_TRAINING_COST: Resources = { crystals: 400, gas: 0 }

export const SOLDIER_INIT_HP = 300

export const SOLDIER_INIT_MOVEMENT_SPEED = 10

export const SOLDIER_INIT_AGGRO_RANGE = 5
export const SOLDIER_INIT_ATTACK_ACCURACY = 65
export const SOLDIER_INIT_ATTACK_RANGE = 3
export const SOLDIER_INIT_ATTACK_DAMAGE = 5
export const SOLDIER_INIT_ATTACK_DAMAGE_RADIUS = 1

// specialist

export const SPECIALIST_TRAINING_COST: Resources = { crystals: 550, gas: 100 }

export const SPECIALIST_INIT_HP = 300

export const SPECIALIST_INIT_MOVEMENT_SPEED = 6

export const SPECIALIST_INIT_AGGRO_RANGE = 5
export const SPECIALIST_INIT_ATTACK_ACCURACY = 100
export const SPECIALIST_INIT_ATTACK_RANGE = 5
export const SPECIALIST_INIT_ATTACK_DAMAGE = 6
export const SPECIALIST_INIT_ATTACK_DAMAGE_RADIUS = 3

// structure

export const COMMAND_CENTER_BUILDING_COST: Resources = { crystals: 4_000, gas: 1_000 }
export const COMMAND_CENTER_BUILDING_DURATION = 30
export const COMMAND_CENTER_INIT_HP = 3_000

export const GAS_REFINERY_BUILDING_COST: Resources = { crystals: 1_000, gas: 0 }
export const GAS_REFINERY_BUILDING_DURATION = 30
export const GAS_REFINERY_INIT_HP = 2_400

export const BARRACKS_BUILDING_COST: Resources = { crystals: 1_200, gas: 400 }
export const BARRACKS_BUILDING_DURATION = 30
export const BARRACKS_INIT_HP = 2_000
