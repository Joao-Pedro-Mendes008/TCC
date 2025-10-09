import { SessionContext } from "@/context/sessionContext";
import supabase from "../../supabase/client";
import { useContext } from "react";

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

export async function createUser({ session }) {
    try {
        if (!session || session.user) {
            console.error("Usuário não encontrado erro: ()")
            return null
        }

        const user = {
            name: session.user.user_metadata.name,
            email: session.user.email,
            phone: session.user.user_metadata.phone,
            role: session.user.user_metadata.role
        };

        if (!user.email || !user.role) {
            console.log("Erro ao criar usuário (erro: 501)")
            return null
        }
        const { error } = await supabase
            .from('patients')
            .insert({ name: user.name, email: user.email, phone: user.phone, role: user.role })

        if (error) {
            console.error("Erro ao adicionar usuário", error.message);
        }

    } catch (err) {
        console.error("Não foi possível se conectar ao servidor", err.message)
    }
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