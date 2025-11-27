import supabase from "../../utils/supabase/client";

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
}) {
    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nome, telefone, role: "paciente" },
                emailRedirectTo: 'http://localhost:3000/',
                shouldCreateUser: true
            }
        });

        if (signUpError) {
            console.error(signUpError.message);
            return null;
        }

        const userId = signUpData.user?.id;

        if (!userId) return null;

        const { data: insertData, error: insertError } = await supabase
            .from('usuarios')
            .upsert({
                id: userId,
                email,
                nome_completo: nome,
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
            }, {
                onConflict: 'email'
            })
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

export async function consulSignUp({
  email,
  password,
  telefone,
  nome,
  cep,
  endereco,
  numero,
  cidade,
  estado,
  complemento,
  especialidade,
  cnpj
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, telefone, role: "consultorio" },
        emailRedirectTo: "https://localhost:3000/"
      }
    });

    if (error || !data.user) {
      console.error("Erro ao cadastrar consultório:", error?.message);
      return { user: null, error };
    }

    const { data: insertData, error: insertError } = await supabase
      .from("consultorios")
      .insert([
        {
          id: data.user.id,
          email,
          telefone,
          nome,
          cep,
          endereco,
          numero,
          cidade,
          estado,
          complemento,
          especialidade,
          cnpj
        }
      ])
      .select();

    if (insertError || !insertData) {
      console.error("Erro ao criar consultório:", insertError?.message);
      return { user: data.user, error: insertError };
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error("Erro inesperado:", err);
    return { user: null, error: err };
  }
}
