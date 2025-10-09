import supabase from "../../supabase/client";

export async function signUp({ email, password, name, phone, role }) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone, role },
                emailRedirectTo: 'http://localhost:3000/signIn',
                shouldCreateUser: true
            }
        });
        if (!data) {
            console.error(error.message);
            return null
        };
        return data.user
    } catch (err) {
        console.error(err);
        return null
    }
};

export async function createUser({}) {
    try {

    } catch { }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) return { user: null, error };
        return { user: data.user, error: null };
    } catch (err) {
        console.error("Erro inesperado:", err);
        return { user: null, error: err };
    }
};