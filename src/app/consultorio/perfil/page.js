"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import BotaoVoltar from "@/components/ui/botaoVoltar";
import { Mail, MapPin, FileBadge, User, Edit } from "lucide-react";
import "@/styles/perfil.css";

export default function PerfilConsultorio() {
    const { session } = useContext(SessionContext);
    const router = useRouter();
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfil = async () => {
            if (!session?.user) return;

            try {
                const { data, error } = await supabase
                    .from('consultorios') 
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error) throw error;
                if (data) setDados(data);
                
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPerfil();
        }
    }, [session]);

    if (loading) {
        return (
            <div>
                <NavBar />
                <Container>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <p>Carregando informações...</p>
                    </div>
                </Container>
            </div>
        );
    }

    const avatarUrl = dados?.avatar_url || session?.user?.user_metadata?.avatar_url;

    return (
        <div>
            <NavBar />
            <Container>
                
                <div className="profile-header">
                    <div className="profile-cover"></div>
                    
                    <div className="profile-avatar-container">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <User size={64} color="#888" />
                            </div>
                        )}
                    </div>

                    <h2 className="profile-name">
                        {dados?.nome || session?.user?.user_metadata?.nome}
                    </h2>
                    <span className="profile-badge">Consultório</span>
                </div>

                <div className="profile-grid">
                    
                    <div className="info-card">
                        <div className="card-header">
                            <Mail className="icon-blue" size={20}/>
                            <h3>Contato</h3>
                        </div>
                        <div className="card-body">
                            <div className="info-item">
                                <label>E-mail</label>
                                <p>{dados?.email || session?.user?.email}</p>
                            </div>
                            <div className="info-item">
                                <label>Telefone</label>
                                <p>{dados?.telefone || "—"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <FileBadge className="icon-blue" size={20}/>
                            <h3>Dados Profissionais</h3>
                        </div>
                        <div className="card-body">
                            <div className="info-item">
                                <label>Especialidade</label>
                                <p>{dados?.especialidade || "Clínica Geral"}</p>
                            </div>
                            <div className="info-item">
                                <label>CNPJ</label>
                                <p>{dados?.cnpj || "—"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-card full-width">
                        <div className="card-header">
                            <MapPin className="icon-blue" size={20}/>
                            <h3>Localização</h3>
                        </div>
                        <div className="card-body">
                            <p className="endereco-text">
                                {dados?.endereco || "Endereço não cadastrado."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="action-bar">
                    <BotaoVoltar />
                    <button 
                        className="btn-editar" 
                        onClick={() => router.push('/consultorio/perfil/editar')}
                    >
                        <Edit size={16} />
                        Editar Perfil
                    </button>
                </div>

            </Container>
        </div>
    );
}