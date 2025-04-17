// src/stores/sessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../interfaces/UserInterface";

interface SessionState {
    accessToken: string | null;
    user: User | null;
    setSession: (accessToken: string, user: User) => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setSession: (accessToken, user) => set({ accessToken, user }),
            clearSession: () => set({ accessToken: null, user: null }),
        }),
        {
            name: "afk2scrty",
        }
    )
);
