import { create } from "zustand";
import { IUser } from "../types";
interface UserState {
    user: IUser | undefined;
    setUser: (user: IUser | null) => void;
}
//Custom hook with Zustand create, initializes user state, provides set function to update
export const useUser = create<UserState>()((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user })),
}));
