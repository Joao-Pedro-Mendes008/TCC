"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon, User, Search, X } from "lucide-react";
import "@/styles/agenda.css";

export default function AgendaConsultorio() {
    const { session } = useContext(SessionContext);
    const router = useRouter();
    
    const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState("");

    useEffect(() => {
        const fetchAgenda = async () => {
            if (!session?.user) return;
            setLoading(true);

            let query = supabase
                .from('consultas')
                .select(`
                    *,
                    usuarios!inner (nome_completo, cpf), 
                    procedimentos (nome_procedimento)
                `)
                .eq('id_consultorio', session.user.id);

            if (termoBusca.length > 0) {
                // ALTERADO: Removida a primeira % para buscar "Começa com"
                query = query
                    .ilike('usuarios.nome_completo', `${termoBusca}%`)
                    .order('data_consulta', { ascending: false });
            } else {
                query = query
                    .eq('data_consulta', dataSelecionada)
                    .order('horario', { ascending: true });
            }

            const { data, error } = await query;

            if (error) {
                console.error("Erro ao buscar agenda:", error);
            } else {
                setConsultas(data || []);
            }
            setLoading(false);
        };

        const delayDebounceFn = setTimeout(() => {
            fetchAgenda();
        }, 300);

        return () => clearTimeout(delayDebounceFn);

    }, [session, dataSelecionada, termoBusca]);

    const alterarData = (tipo, quantidade) => {
        const [ano, mes, dia] = dataSelecionada.split('-').map(Number);
        const novaData = new Date(ano, mes - 1, dia);

        if (tipo === 'dia') {
            novaData.setDate(novaData.getDate() + quantidade);
        } else if (tipo === 'mes') {
            const diaOriginal = novaData.getDate();
            novaData.setMonth(novaData.getMonth() + quantidade);
            if (novaData.getDate() !== diaOriginal) {
                novaData.setDate(0); 
            }
        }

        const y = novaData.getFullYear();
        const m = String(novaData.getMonth() + 1).padStart(2, '0');
        const d = String(novaData.getDate()).padStart(2, '0');

        setDataSelecionada(`${y}-${m}-${d}`);
    };

    const formatarDataExibicao = (dateString) => {
        const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString + 'T12:00:00'); 
        return date.toLocaleDateString('pt-BR', opcoes);
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmada': return 'status-verde';
            case 'realizada': return 'status-azul';
            case 'cancelada': return 'status-vermelho';
            default: return 'status-cinza';
        }
    };

    return (
        <div>
            <NavBar />
            <Container>
                
                <div className="agenda-header">
                    <h2>Agenda e Pacientes</h2>

                    <div className="search-bar-container">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="text"
                                placeholder="Buscar paciente por nome..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                            {termoBusca && (
                                <button className="btn-clear" onClick={() => setTermoBusca("")}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {!termoBusca && (
                        <div className="date-controls-wrapper">
                            <div className="date-controls">
                                <button onClick={() => alterarData('mes', -1)} className="btn-nav secondary" title="Mês Anterior">
                                    <ChevronsLeft size={20} />
                                </button>
                                
                                <button onClick={() => alterarData('dia', -1)} className="btn-nav" title="Dia Anterior">
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className="date-display">
                                    <label htmlFor="date-picker" className="date-label">
                                        <CalendarIcon size={18} />
                                        <span>{formatarDataExibicao(dataSelecionada)}</span>
                                    </label>
                                    <input 
                                        id="date-picker"
                                        type="date" 
                                        value={dataSelecionada} 
                                        onChange={(e) => setDataSelecionada(e.target.value)}
                                        className="date-input-hidden"
                                    />
                                </div>

                                <button onClick={() => alterarData('dia', 1)} className="btn-nav" title="Próximo Dia">
                                    <ChevronRight size={20} />
                                </button>

                                <button onClick={() => alterarData('mes', 1)} className="btn-nav secondary" title="Próximo Mês">
                                    <ChevronsRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="agenda-list">
                    {termoBusca && (
                        <div className="search-results-info">
                            Mostrando resultados para: <strong>"{termoBusca}"</strong>
                        </div>
                    )}

                    {loading ? (
                        <p className="loading-text">Buscando dados...</p>
                    ) : consultas.length === 0 ? (
                        <div className="empty-state">
                            {termoBusca ? (
                                <p>Nenhum paciente encontrado.</p>
                            ) : (
                                <p>Nenhuma consulta agendada para este dia.</p>
                            )}
                        </div>
                    ) : (
                        consultas.map((c) => (
                            <div 
                                key={c.id} 
                                className="agenda-card"
                                onClick={() => router.push(`/consultorio/consulta?id=${c.id}`)}
                            >
                                <div className="time-col">
                                    {termoBusca ? (
                                        <div className="date-time-box">
                                            <span className="dt-day">{new Date(c.data_consulta).getDate()}/{new Date(c.data_consulta).getMonth()+1}</span>
                                            <span className="dt-time">{c.horario.slice(0, 5)}</span>
                                        </div>
                                    ) : (
                                        <span className="time">{c.horario.slice(0, 5)}</span>
                                    )}
                                </div>

                                <div className="details-col">
                                    <h4 className="patient-name">
                                        <User size={16} />
                                        {c.usuarios?.nome_completo || "Paciente não identificado"}
                                    </h4>
                                    <p className="procedure">
                                        {c.procedimentos?.nome_procedimento || "Consulta"}
                                    </p>
                                    {c.desc && <p className="notes">{c.desc}</p>}
                                </div>

                                <div className="status-col">
                                    <span className={`status-badge ${getStatusColor(c.status)}`}>
                                        {c.status || "Pendente"}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </Container>
        </div>
    );
}