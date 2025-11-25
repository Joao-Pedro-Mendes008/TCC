"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/../utils/supabase/client";
import { Check, Trash2, EllipsisVertical } from 'lucide-react';
import "@/styles/components/nextConsultas.css";
import { confirmarConsulta, cancelarConsulta } from "@/hooks/consultas";

export default function ListaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [idSelecionado, setIdSelecionado] = useState("")
  const router = useRouter();

  const handleClick = (id) => {
    setIdSelecionado(id);
    router.push(`/consultorio/consulta?id=${id}`);
  };

  const handleConfirmar = async (id) => {
    try {
      await confirmarConsulta(id);
    } catch (error) {
      alert("Erro ao confirmar: " + error.message);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await cancelarConsulta(id);
    } catch (error) {
      alert("Erro ao cancelar: " + error.message);
    }
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
      {consultas.length === 0 ? (
        <p>Nenhuma consulta agendada.</p>
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
              {new Date(c.data_consulta).toLocaleDateString('pt-BR')} às {c.horario}
            </div>

            <div className="card-status">
              {c.status}
            </div>

            <div className="botoes">
              <button className="btn-confirmar" onClick={() => handleConfirmar(c.id).then(() => window.location.reload())}><Check /></button>
              <button className="btn-cancelar" onClick={() => handleCancelar(c.id).then(() => window.location.reload())}><Trash2 /></button>
              <button className="btn-detalhes" onClick={()=> handleClick(c.id)}><EllipsisVertical /></button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}