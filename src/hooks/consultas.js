import supabase from "@/../utils/supabase/client";
import { useRouter } from "next/navigation";

export async function agendarConsulta({
    desc,
    id_paciente,
    data_consulta,
    horario,
    id_procedimento
}) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Usuário não autenticado");

        const { data: consulta, error: consultaError } = await supabase
            .from('consultas')
            .insert({
                desc,
                horario,
                data_consulta,
                id_procedimento: id_procedimento,
                id_consultorio: user.id,
                id_paciente: id_paciente
            })
            .select()
            .single();

        if (consultaError) return { error: consultaError.message };

        return { data: consulta, error: null };

    } catch (err) {
        return { error: err.message };
    }

};

export async function listConsultas(id_consultorio) {
    try {
        const { data: consultas, error } = await supabase
            .from('consultas')
            .select(`
                *,
                usuarios (nome_completo),
                procedimentos (nome_procedimento)
            `)
            .eq('id_consultorio', id_consultorio);

        if (error) throw error;

        return { consultas, error: null };
    } catch (err) {
        return { consultas: [], error: err };
    }

};

export async function updateConsulta(id_consulta, dadosAtualizados) {
    try {
        const { data: consulta, error } = await supabase
            .from('consultas')
            .update(dadosAtualizados)
            .eq('id', id_consulta)
            .select();

        if (error) throw error;

        return { consulta, error: null };
    } catch (err) {
        return { error: err };
    }

};

export async function confirmarConsulta(id_consulta) {
    try {
        const { error } = await supabase
            .from('consultas')
            .update({ status: 'Confirmada' })
            .eq('id', id_consulta);

        if (error) throw error;

        return { error: null };
    } catch (err) {
        return { error: err };
    }

}

export async function realizarConsulta(id_consulta) {
    try {
        const { error } = await supabase
            .from('consultas')
            .update({ status: 'Realizada' })
            .eq('id', id_consulta);

        if (error) throw error;
        return { error: null };
    } catch (err) {
        return { error: err };
    }

}

export async function cancelarConsulta(id_consulta) {
    try {
        const { error } = await supabase
            .from('consultas')
            .delete()
            .eq('id', id_consulta);

        if (error) throw error;
        return { error: null };
    } catch (err) {
        return { error: err };
    }
}

export async function desconfirmarConsulta(id_consulta) {
    try {
        const { error } = await supabase
            .from('consultas')
            .update({ status: 'Não confirmada' })
            .eq('id', id_consulta);

        if (error) throw error;

        return { error: null };
    } catch (err) {
        return { error: err };
    }

}


export async function getConsultaById(idConsulta, idConsultorioAtual) {
    try {
        const { data, error } = await supabase
            .from("consultas")
            .select(`
                *,
                procedimentos ( nome_procedimento, preco ),
                usuarios (
                    nome_completo,
                    email,
                    telefone
                )
            `)
            .eq("id", idConsulta)
            .eq("id_consultorio", idConsultorioAtual)
            .single();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}
