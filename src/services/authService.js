import { supabase } from '../lib/supabase';
import { supabaseNoSession } from '../lib/supabaseNoSession';

export const authService = {
    async login(email, password) {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    async logout() {
        return await supabase.auth.signOut();
    },

    async getUser() {
        return await supabase.auth.getUser();
    },

    onAuthStateChange(callback) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
        return subscription;
    },

    async signUp(email, password) {
        return await supabase.auth.signUp({
            email,
            password,
        });
    },

    async signUpNoSession(email, password) {
        return await supabaseNoSession.auth.signUp({
            email,
            password,
        });
    },

    async updatePassword(password) {
        return await supabase.auth.updateUser({
            password,
        });
    }
};
