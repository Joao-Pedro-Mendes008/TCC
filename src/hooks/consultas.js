import supabase from "../../utils/supabase/client";

export async function newConsulta({
    desc,
    horario_marcado,
    id_paciente,
    id_consultorio
})