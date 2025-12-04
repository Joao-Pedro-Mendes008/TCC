"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import BotaoVoltar from "@/components/ui/botaoVoltar";
import { User, Phone, Mail, MapPin, FileText, Calendar, Edit, Activity } from "lucide-react";
import "@/styles/paciente-perfil.css";

export default function PerfilPaciente() {
    const { id } = useParams();
    const { session } = useContext(SessionContext);
    const router = useRouter();

    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaciente = async () => {
            if (!session?.user || !id) return;

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Erro ao buscar paciente:", error);
            } else {
                setPaciente(data);
            }
            setLoading(false);
        };

        fetchPaciente();
    }, [id, session]);

    if (loading) return <div>Carregando prontuário...</div>;
    if (!paciente) return <div>Paciente não encontrado.</div>;

    return (
        <div>
            <NavBar />
            <Container>
                
                <div className="patient-header-card">
                    <div className="patient-avatar-section">
                        {paciente.avatar_url ? (
                            <img src={paciente.avatar_url} alt={paciente.nome_completo} className="patient-avatar-lg" />
                        ) : (
                            <div className="patient-avatar-placeholder-lg">
                                <User size={40} color="#fff" />
                            </div>
                        )}
                    </div>
                    
                    <div className="patient-info-main">
                        <h2>{paciente.nome_completo}</h2>
                        <p className="cpf-badge">CPF: {paciente.cpf || "Não informado"}</p>
                    </div>

                    <div className="patient-actions">
                        <button className="btn-action primary" onClick={() => router.push(`/consultorio/pacientes/${id}/anamnese`)}>
                            <Activity size={18} />
                            Anamnese
                        </button>
                    </div>
                </div>

                <div className="patient-content-grid">
                    
                    <div className="info-section">
                        <div className="section-title">
                            <h3>Dados Pessoais</h3>
                            <button className="btn-icon-edit" onClick={() => router.push(`/consultorio/pacientes/${id}/editar`)}><Edit size={14}/></button>
                        </div>
                        
                        <div className="info-list">
                            <div className="info-item">
                                <Phone size={16} className="icon-muted" />
                                <div>
                                    <label>Telefone</label>
                                    <p>{paciente.telefone || "—"}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <Mail size={16} className="icon-muted" />
                                <div>
                                    <label>Email</label>
                                    <p>{paciente.email || "—"}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <MapPin size={16} className="icon-muted" />
                                <div>
                                    <label>Endereço</label>
                                    <p>{paciente.endereco || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <div className="section-title">
                            <h3>Resumo Clínico</h3>
                        </div>
                        <div className="clinical-summary">
                            <p className="empty-msg">Nenhuma observação rápida registrada.</p>
                            <button className="btn-link" onClick={() => router.push(`/consultorio/pacientes/${id}/anamnese`)}>
                                Ver ficha completa <FileText size={14} />
                            </button>
                        </div>
                    </div>

                </div>

                <BotaoVoltar />
            </Container>
        </div>
    );
}