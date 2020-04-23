import { inject, injectable } from "inversify";
import SERVICE_IDENTIFIER from "./Identifiers";
import Weapon from "@/interfaces/Checklist";
import Warrior from "@/interfaces/Report";

@injectable()
class Ninja implements Warrior {
    public constructor(
        @inject(SERVICE_IDENTIFIER.WEAPON) weapon: Weapon
    ) {
        this.name = "Ninja";
        this.weapon = weapon;
    }

    public name: string;
    public weapon: Weapon;
}

@injectable()
class Samurai implements Warrior {
    public constructor(
        @inject(SERVICE_IDENTIFIER.WEAPON) weapon: Weapon
    ) {
        this.name = "Samurai";
        this.weapon = weapon;
    }

    public name: string;
    public weapon: Weapon;
}

export { Ninja, Samurai };