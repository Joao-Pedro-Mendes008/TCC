"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/../utils/supabase/client";
import { Check, Trash2 } from 'lucide-react';
import "@/styles/components/nextConsultas.css";

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [idSelecionado, setIdSelecionado] = useState("")
   const router = useRouter();

  const handleClick = (id) => {
    setIdSelecionado(id);
    router.push(`/consultorio/consulta?id=${id}`);
  };

  useEffect(() => {
    const fetchConsultas = async () => {
      const { data: consultasAgendadas, error } = await supabase
        .from('consultas')
        .select(`
            *,
            usuarios (nome_completo),
            procedimentos (nome_procedimento)
        `)
        .order('data_consulta', { ascending: false })
        .limit(5);

      if (error) {
        console.log("Erro ao buscar:", error);
      } else {
        setConsultas(consultasAgendadas);
      }
    };

    fetchConsultas();
  }, []);

  return (
    <div>
      <h3 className="titulo-secao">Últimos Agendamentos</h3>
      
      <ul className="lista-container">
        {consultas.map((c) => (
          <li key={c.id} className="card" onClick={() => handleClick(c.id)}>
             
             <span className="card-procedimento">
                {c.procedimentos?.nome_procedimento || "Procedimento não informado"}
             </span>

             <span className="card-nome">
                {c.usuarios?.nome_completo || "Paciente desconhecido"}
             </span>

             <div className="card-data">
                 {new Date(c.data_consulta).toLocaleDateString('pt-BR')} às {c.horario}
             </div>

             <div className="botoes">
             <button className="btn-confirmar"><Check /></button>
             <button className="btn-cancelar"><Trash2 /></button>
             </div>
          </li>
        ))}
      </ul>
    </div>
  );
}