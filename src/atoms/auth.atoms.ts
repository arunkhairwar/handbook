import { atom } from "jotai";
import { User } from "../types";
import { AuthStatus } from "../enums";

export const authLoadingAtom = atom<boolean>(false);
export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);
export const authStatusAtom = atom<AuthStatus>(AuthStatus.UNAUTHENTICATED);
