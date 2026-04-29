import { AppState, Platform } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'


const SUPABASE_URL = "https://kmtannaurbjkrouuelkz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zoGexKNdBJJNZivc5uK3Ew_Q2rpin-j";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});  


if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if( state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh();
        }
})}
