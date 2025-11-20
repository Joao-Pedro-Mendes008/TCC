import supabase from "../../utils/supabase/client";

export async function newConsulta(
    {
        desc,
        horario_marcado,
        id_paciente,
        id_consultorio
    }
) {
    const { data, error } = supabase
        .from('consultas')
        .insert(
            [
                {
                    desc,
                    horario_marcado,
                    id_paciente,
                    id_consultorio // lembrar de colocar o id atual do consultório no front
                }
            ]
        )
};

export async function listConsulta(id_consultorio) {
    try {
        const { data, error } = await supabase
            .from('consultas')
            .select('*')
            .eq('id_consultorio', id_consultorio)

        if (!data || error) {
            console.log("Erro ao obter ID do consultório")
            return 
        }
    } catch (err) {

    }
}



export async function listConsultaByName(id_consultorio, nome_paciente) {

    try {
        const { data: paciente, error: errorPaciente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('nome', nome_paciente)
            .limit(1)

        if (!paciente || errorPaciente) {
            console.log("O paciente não existe")
            return { paciente: null, errorPaciente }
        }

        const { data, error } = await supabase
            .from('consultas')
            .select('*')
            .eq('id_consultorio', id_consultorio)
            .eq('id_paciente', paciente.id)

        if (!data || error) {
            console.log("Paciente não encontrado", error)
            return { data: null, error }
        }
        console.log("Paciente encontrado com sucesso!")
        return { data, error: null }

    } catch (err) {
        console.log("Erro" + err)
    }
}


