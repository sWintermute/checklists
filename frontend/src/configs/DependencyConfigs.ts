import { Container } from "inversify";
import "reflect-metadata";
import SERVICE_IDENTIFIER from "../models/Identifiers";
import Weapon from "@/interfaces/Checklist";
import Warrior from "@/interfaces/Report";
import { Shuriken } from "@/models/Checklist";
import { Ninja } from "@/models/Report";

let container: Container = new Container();

container.bind<Warrior>(SERVICE_IDENTIFIER.WARRIOR).to(Ninja);
container.bind<Weapon>(SERVICE_IDENTIFIER.WEAPON).to(Shuriken);

export default container;