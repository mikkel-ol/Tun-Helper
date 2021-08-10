import { Service } from "typedi";
import { SignupComposition } from "../types/SignupComposition";

@Service()
export class CompositionService {
    constructor() {}

    makeGroups(all: SignupComposition) {
        const remaining = { ...all };

        // make a new group for each tank
        all.tanks.forEach((tank) => {
            const group: any = {};

            const randomHealer1 = remaining.healers.pop();
            const randomHealer2 = remaining.healers.pop();

            const randomDps1 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps2 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps3 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps4 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps5 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps6 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();
            const randomDps7 = Math.round(Math.random()) ? all.ranged.pop() : all.melee.pop();

            group.tank = tank;
            group.healers = [randomHealer1, randomHealer2];
            group.dps = [randomDps1, randomDps2, randomDps3, randomDps4, randomDps5, randomDps6, randomDps7];

            console.log(group);
            
        });
    }
}
