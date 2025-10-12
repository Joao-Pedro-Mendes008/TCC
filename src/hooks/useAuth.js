import supabase from "../../supabase/client";

export async function signUpPacientes({ 
    email,
    password, 
    nome, 
    telefone, 
    data_nascimento,
    cpf,
    genero,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    cep,
    role 
}) {
    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, telefone, role },
                emailRedirectTo: 'http://localhost:3000/signIn',
                shouldCreateUser: true
            }

        });
        if (signUpError) {
            console.error(signUpError.message);
            return null
        };

        const { data: insertData, error: insertError } = await supabase
        .from('pacientes')
        .insert([{
            id: signUpData.user.id,
            email,
            nome,
            telefone,
            data_nascimento,
            cpf,
            genero,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep
        }])
        .select();

        if (insertError) {
            console.error("error ao criar usuário.", insertError.message)
            return null
        }

        return insertData[0];
    } catch (err) {
        console.error(err);
        return null
    }
};

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