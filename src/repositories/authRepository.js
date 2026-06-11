import { supabase } from '../lib/supabase';
import { supabaseNoSession } from '../lib/supabaseNoSession';

export const authRepository = {
    signIn: (email, password) =>
        supabase.auth.signInWithPassword({ email, password }),

    signOut: () =>
        supabase.auth.signOut(),

    getUser: () =>
        supabase.auth.getUser(),

    signUp: (email, password) =>
        supabase.auth.signUp({ email, password }),

    signUpIsolated: (email, password) =>
        supabaseNoSession.auth.signUp({ email, password }),

    updatePassword: (password) =>
        supabase.auth.updateUser({ password }),

    onAuthStateChange: (callback) => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
        return subscription;
    },
};
