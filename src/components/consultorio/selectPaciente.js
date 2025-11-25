"use client"
import { useState, useEffect } from "react";
import supabase from "@/../utils/supabase/client";
import "@/styles/components/selectPaciente.css"

export default function SelectPaciente({ setPacienteId }) {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");

  const formataData = (data) => {
    if(!data) return "";
    return new Date(data).toLocaleDateString('pt-BR');
  }

  useEffect(() => {
    const fetchPacientes = async () => {
      let query = supabase
        .from('usuarios')
        .select('id, nome_completo, cpf, data_nascimento') 
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
  }, [busca]);

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