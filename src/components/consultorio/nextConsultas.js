"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/../utils/supabase/client";
import { Check, Trash2, EllipsisVertical } from 'lucide-react';
import "@/styles/components/nextConsultas.css";
import { confirmarConsulta, cancelarConsulta } from "@/hooks/consultas";

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const router = useRouter();
  
  const idConsultorioLogado = "ID-DO-SEU-CONSULTORIO-AQUI";

  const handleClick = (id) => {
    router.push(`/consultorio/consulta?id=${id}`);
  };

  const handleConfirmar = async (id) => {
    try {
      await confirmarConsulta(id);
      setConsultas(prev => prev.map(c => 
        c.id === id ? { ...c, status: "Confirmada" } : c
      ));
    } catch (error) {
      alert("Erro ao confirmar: " + error.message);
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar?")) return;
    try {
      await cancelarConsulta(id);
      setConsultas(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Erro ao cancelar: " + error.message);
    }
  }; 

  useEffect(() => {
    const fetchConsultas = async () => {
      if (!idConsultorioLogado) return;

      const hoje = new Date();
      const diaSemana = hoje.getDay();
      
      const dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - diaSemana);
      
      const dataFim = new Date(hoje);
      dataFim.setDate(hoje.getDate() + (6 - diaSemana));

      const startStr = new Date(dataInicio.getTime() - (dataInicio.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const endStr = new Date(dataFim.getTime() - (dataFim.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const { data: consultasAgendadas, error } = await supabase
        .from('consultas')
        .select(`
            *,
            usuarios (nome_completo),
            procedimentos (nome_procedimento)
        `)
        .eq('id_consultorio', idConsultorioLogado)
        .gte('data_consulta', startStr)
        .lte('data_consulta', endStr)
        .order('data_consulta', { ascending: true })
        .order('horario', { ascending: true });

      if (error) {
        console.log("Erro ao buscar:", error);
      } else {
        setConsultas(consultasAgendadas || []);
      }
    };

    fetchConsultas();
  }, []);

  return (
    <div>
      <h3 className="titulo-secao">Agenda da Semana</h3>
      {consultas.length === 0 ? (
        <p>Nenhuma consulta para esta semana.</p>
      ) : (
        <ul className="lista-container">
        {consultas.map((c) => (
          <li key={c.id} className="card">

            <span className="card-procedimento">
              {c.procedimentos?.nome_procedimento || "Procedimento não informado"}
            </span>

            <span className="card-nome">
              {c.usuarios?.nome_completo || "Paciente desconhecido"}
            </span>

            <div className="card-data">
              {new Date(c.data_consulta + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
              {' '} às {c.horario.slice(0, 5)}
            </div>

            <div className="card-status">
              {c.status}
            </div>

            <div className="botoes">
              <button className="btn-confirmar" onClick={() => handleConfirmar(c.id)}><Check /></button>
              <button className="btn-cancelar" onClick={() => handleCancelar(c.id)}><Trash2 /></button>
              <button className="btn-detalhes" onClick={()=> handleClick(c.id)}><EllipsisVertical /></button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}