"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/../utils/supabase/client"; // Ajustei o import para o padrão
import { Check, Trash2, EllipsisVertical } from 'lucide-react';
import "@/styles/components/nextConsultas.css";
import { confirmarConsulta, cancelarConsulta } from "@/hooks/consultas";
import { SessionContext } from "@/context/sessionContext";

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const router = useRouter();
  const { session } = useContext(SessionContext);

  const idConsultorioLogado = session?.user?.id;

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

        // 1. Calcular datas da Semana Atual (Domingo a Sábado)
        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0 = Domingo, 6 = Sábado
        
        const dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - diaSemana);
        
        const dataFim = new Date(hoje);
        dataFim.setDate(hoje.getDate() + (6 - diaSemana));

        // Ajuste de fuso horário para garantir string YYYY-MM-DD correta
        const startStr = new Date(dataInicio.getTime() - (dataInicio.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        const endStr = new Date(dataFim.getTime() - (dataFim.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        const { data: consultasAgendadas, error } = await supabase
            .from('consultas')
            .select(`
                *,
                usuarios!inner (
                    nome_completo,
                    consultorios_usuarios!inner (
                        consultorio_id
                    )
                ),
                procedimentos (nome_procedimento)
            `)
            .eq('id_consultorio', idConsultorioLogado)
            .eq('usuarios.consultorios_usuarios.consultorio_id', idConsultorioLogado)
            .gte('data_consulta', startStr) // Filtra >= Domingo
            .lte('data_consulta', endStr)   // Filtra <= Sábado
            .neq('status', 'Realizada')     // Oculta as já realizadas
            .order('data_consulta', { ascending: true })
            .order('horario', { ascending: true });

        if (error) {
            console.log("Erro ao buscar:", error);
        } else {
            setConsultas(consultasAgendadas || []);
        }
    };

    fetchConsultas();
  }, [idConsultorioLogado]);

  return (
    <div style={{ width: '100%' }}>
      <h3 className="titulo-secao">Agenda da Semana</h3>
      {consultas.length === 0 ? (
        <p>Nenhuma consulta pendente para esta semana.</p>
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

            <div className={`card-status ${c.status === 'Confirmada' ? 'text-green-600' : ''}`}>
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