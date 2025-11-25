"use client"

import { useState, useContext, useEffect } from "react";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import { SessionContext } from "@/context/sessionContext";
import "@/styles/consultorio.css"
import { agendarConsulta } from "@/hooks/consultas";
import SelectPaciente from "@/components/consultorio/selectPaciente";
import SelectProcedimento from "@/components/consultorio/selectProcedimento";
import ListaConsultas from "@/components/consultorio/nextConsultas";
import supabase from "@/../utils/supabase/client"

export default function ConsultorioDashboard() {
  const { session } = useContext(SessionContext);

  const [loading, setLoading] = useState(false);
  const [pacienteId, setPacienteId] = useState("");
  const [procedimentoId, setProcedimentoId] = useState("");
  const [desc, setDesc] = useState("");
  const [horario, setHorario] = useState("");
  const [data_consulta, setDataConsulta] = useState("");

  if (!session) return <div style={{ padding: "20px" }}>Carregando sessão...</div>

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!pacienteId || !procedimentoId || !data_consulta || !horario) {
      alert("Preencha todos os campos obrigatórios!");
      setLoading(false);
      return;
    }

    const { error: errorAgendamento } = await agendarConsulta({
      desc,
      id_paciente: pacienteId,
      data_consulta,
      horario,
      id_procedimento: procedimentoId
    });

    setLoading(false);

    if (errorAgendamento) {
      alert("Erro ao agendar, selecione outro horário ou data!");
    } else {
      alert("Consulta agendada com sucesso!");
      setDesc("");
      setHorario("");
      setDataConsulta("");
      window.location.reload();
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h3 className="titulo-ola">
          Olá, {session?.user?.user_metadata?.nome || "Doutor(a)"}
        </h3>

        <div className="card-maior">
          <h4 className="titulo-secao">Proximas consultas</h4>
          <ListaConsultas />
        </div>

        <div className="card-maior">
          <h4 className="titulo-secao">Agendar consulta</h4>

          <form onSubmit={handleSubmit} className="form-consulta">

            <SelectPaciente setPacienteId={setPacienteId} />

            <SelectProcedimento setProcedimentoId={setProcedimentoId} />

            <label className="label-busca">Descrição / Observações</label>

            <input
              type="text"
              placeholder="Descrição / Observações"
              className="input-padrao"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <label className="label-busca">Selecione o horário</label>

            <input
              type="time"
              className="input-padrao"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              required
            />

            <label className="label-busca">Selecione a data</label>

            <input
              type="date"
              className="input-padrao"
              value={data_consulta}
              onChange={(e) => setDataConsulta(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-agendar"
            >
              {loading ? "Agendando..." : "Agendar"}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}