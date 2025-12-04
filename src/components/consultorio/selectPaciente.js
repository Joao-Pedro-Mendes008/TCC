"use client"
import { useState, useEffect, useContext } from "react";
import supabase from "@/../utils/supabase/client";
import "@/styles/components/selectPaciente.css"
import { SessionContext } from "@/context/sessionContext"; // Import necessário para o filtro

export default function SelectPaciente({ setPacienteId }) {
  const { session } = useContext(SessionContext); // Pega o usuário logado
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");

  const formataData = (data) => {
    if(!data) return "";
    return new Date(data).toLocaleDateString('pt-BR');
  }

  useEffect(() => {
    const fetchPacientes = async () => {
      if (!session?.user?.id) return; // Segurança: só busca se tiver usuário

      let query = supabase
        .from('usuarios')
        .select(`
            id, 
            nome_completo, 
            cpf, 
            data_nascimento,
            consultorios_usuarios!inner(consultorio_id)
        `) 
        // FILTRO: Apenas pacientes deste consultório
        .eq('consultorios_usuarios.consultorio_id', session.user.id)
        .order('nome_completo');

      if (busca.length > 0) {
        query = query.ilike('nome_completo', `%${busca}%`);
      } else {
        query = query.limit(20); 
      }

      const { data, error } = await query;
      if (!error && data) setPacientes(data);
    };

    const timeoutId = setTimeout(() => fetchPacientes(), 300);
    return () => clearTimeout(timeoutId);
  }, [busca, session]);

  return (
    <div className="busca-container">
      <label className="label-busca">Selecione o paciente</label>
      
      <input 
        type="text" 
        placeholder="Digite o nome para buscar..." 
        className="input-padrao"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <select 
        className="select-padrao" 
        onChange={(e) => setPacienteId(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Selecione o paciente correto...</option>
        {pacientes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome_completo} | CPF: {p.cpf || 's/n'}
          </option>
        ))}
      </select>
    </div>
  );
}