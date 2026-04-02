import { atom } from "jotai";
import { Client } from "../types/client.types";

export const clientAtom = atom<Client[]>([]);
