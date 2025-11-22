"use client"
import { useState, useEffect } from "react";
import supabase from "@/../utils/supabase/client";

export default function SelectProcedimento({ setProcedimentoId }) {
  const [procedimentos, setProcedimentos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchProcedimentos = async () => {
      let query = supabase
        .from('procedimentos')
        .select('id, nome_procedimento, preco')
        .order('nome_procedimento');

      if (busca.length > 0) {
        query = query.ilike('nome_procedimento', `%${busca}%`);
      } else {
        query = query.limit(50);
      }

      const { data, error } = await query;
      if (!error && data) setProcedimentos(data);
    };

    const timeoutId = setTimeout(() => fetchProcedimentos(), 300);
    return () => clearTimeout(timeoutId);
  }, [busca]);

  return (
    <div className="busca-container">
      <label className="label-busca">Buscar Procedimento</label>
      
      <input 
        type="text" 
        placeholder="Busque o procedimento..." 
        className="input-padrao"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <select 
        className="select-padrao"
        onChange={(e) => setProcedimentoId(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Selecione o procedimento...</option>
        {procedimentos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome_procedimento} - R$ {p.preco}
          </option>
        ))}
      </select>
    </div>
  );
}