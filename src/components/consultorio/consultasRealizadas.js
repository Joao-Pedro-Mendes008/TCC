"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/../utils/supabase/client";
import { SessionContext } from "@/context/sessionContext";
import { CalendarCheck, User, FileText, ChevronRight } from 'lucide-react';
import "@/styles/components/consultasRealizadas.css";

export default function ConsultasRealizadas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = useContext(SessionContext);
  const router = useRouter();

  useEffect(() => {
    const fetchHistorico = async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('consultas')
            .select(`
                id,
                data_consulta,
                horario,
                desc,
                usuarios!inner ( nome_completo ),
                procedimentos ( nome_procedimento )
            `)
            .eq('id_consultorio', session.user.id)
            .eq('status', 'Realizada')
            .order('data_consulta', { ascending: false })
            .order('horario', { ascending: false })
            .limit(10);

        if (error) {
            console.error("Erro ao buscar histórico:", error);
        } else {
            setConsultas(data || []);
        }
        setLoading(false);
    };

    fetchHistorico();
  }, [session]);

  if (loading) return <div className="loading-state">Carregando histórico...</div>;

  return (
    <div className="historico-container">
      <h3 className="titulo-historico">Histórico de Atendimentos</h3>
      
      {consultas.length === 0 ? (
        <div className="empty-state-historico">
            <CalendarCheck size={40} color="#ccc" />
            <p>Nenhuma consulta realizada encontrada.</p>
        </div>
      ) : (
        <ul className="lista-realizadas">
            {consultas.map((c) => (
            <li key={c.id} className="card-realizada" onClick={() => router.push(`/consultorio/consulta?id=${c.id}`)}>
                
                <div className="card-header-realizada">
                    <span className="data-badge">
                        {new Date(c.data_consulta).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="procedimento-tag">
                        {c.procedimentos?.nome_procedimento || "Consulta"}
                    </span>
                </div>

                <div className="card-body-realizada">
                    <h4 className="paciente-nome">
                        <User size={16} /> {c.usuarios?.nome_completo}
                    </h4>
                    <p className="horario-texto">
                        Realizada às {c.horario.slice(0, 5)}
                    </p>
                    {c.desc && (
                        <p className="resumo-desc">
                            <FileText size={14} /> {c.desc}
                        </p>
                    )}
                </div>

                <div className="card-footer-realizada">
                    <span className="btn-ver-detalhes">
                        Ver Detalhes <ChevronRight size={16} />
                    </span>
                </div>
            </li>
            ))}
        </ul>
      )}
    </div>
  );
}