import { create } from "zustand";
import { IUser } from "../types";
interface UserState {
    user: IUser | undefined;
    // true until SessionProvider's initial session check resolves, so
    // consumers can tell "not logged in" apart from "haven't checked yet".
    isLoading: boolean;
    setUser: (user: IUser | null) => void;
}
//Custom hook with Zustand create, initializes user state, provides set function to update
export const useUser = create<UserState>()((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set(() => ({ user, isLoading: false })),
}));
