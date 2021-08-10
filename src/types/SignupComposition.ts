import { ClassColorPair } from "./ClassColorPair";

export interface SignupComposition {
    tanks: ClassColorPair[];
    healers: ClassColorPair[];
    ranged: ClassColorPair[];
    melee: ClassColorPair[];
}
