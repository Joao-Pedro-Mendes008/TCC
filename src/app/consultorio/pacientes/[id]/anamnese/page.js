"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { SessionContext } from "@/context/sessionContext";
import supabase from "@/../utils/supabase/client";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import BotaoVoltar from "@/components/ui/botaoVoltar";
import { Save, FileHeart, AlertCircle } from "lucide-react";
import "@/styles/anamnese.css";

export default function AnamnesePaciente() {
    const { id } = useParams(); 
    const { session } = useContext(SessionContext);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pacienteNome, setPacienteNome] = useState("");
    
    const [ficha, setFicha] = useState({
        queixa_principal: "",
        historico_doenca_atual: "",
        historico_patologico: "",
        medicamentos_uso: "",
        alergias: "",
        historico_familiar: "",
        habitos_vida: "", 
        observacoes: ""
    });

    useEffect(() => {
        const carregarDados = async () => {
            if (!session?.user || !id) return;

            const { data: user } = await supabase.from('usuarios').select('nome_completo').eq('id', id).single();
            if (user) setPacienteNome(user.nome_completo);

            const { data: anamneseExistente, error } = await supabase
                .from('anamneses')
                .select('*')
                .eq('paciente_id', id)
                .eq('consultorio_id', session.user.id)
                .single();

            if (anamneseExistente) {
                setFicha({
                    queixa_principal: anamneseExistente.queixa_principal || "",
                    historico_doenca_atual: anamneseExistente.historico_doenca_atual || "",
                    historico_patologico: anamneseExistente.historico_patologico || "",
                    medicamentos_uso: anamneseExistente.medicamentos_uso || "",
                    alergias: anamneseExistente.alergias || "",
                    historico_familiar: anamneseExistente.historico_familiar || "",
                    habitos_vida: anamneseExistente.habitos_vida || "",
                    observacoes: anamneseExistente.observacoes || ""
                });
            }
            setLoading(false);
        };

        carregarDados();
    }, [id, session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFicha(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('anamneses')
                .upsert({
                    paciente_id: id,
                    consultorio_id: session.user.id,
                    ...ficha,
                    updated_at: new Date()
                }, { onConflict: 'paciente_id, consultorio_id' });

            if (error) throw error;

            alert("Ficha clínica salva com sucesso!");
            router.back();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar anamnese.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Carregando ficha...</div>;

    return (
        <div>
            <NavBar />
            <Container>
                <form onSubmit={handleSave} className="anamnese-container">
                    
                    <div className="anamnese-header">
                        <div className="header-titles">
                            <h2 className="title-flex"><FileHeart className="icon-red"/> Anamnese</h2>
                            <p>Paciente: <strong>{pacienteNome}</strong></p>
                        </div>
                        <button type="submit" className="btn-save-top" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar Ficha"} <Save size={18} />
                        </button>
                    </div>

                    <div className="form-sections-grid">
                        
                        <div className="form-section full-width highlight-section">
                            <label>Queixa Principal (QP) *</label>
                            <textarea 
                                name="queixa_principal" 
                                value={ficha.queixa_principal} 
                                onChange={handleChange}
                                placeholder="Motivo da consulta..."
                                rows="2"
                                required
                            />
                        </div>

                        <div className="form-section full-width">
                            <label>História da Doença Atual (HDA)</label>
                            <textarea 
                                name="historico_doenca_atual" 
                                value={ficha.historico_doenca_atual} 
                                onChange={handleChange}
                                placeholder="Início, evolução, sintomas associados..."
                                rows="4"
                            />
                        </div>

                        <div className="form-section">
                            <label>Histórico Patológico (Doenças Prévias/Cirurgias)</label>
                            <textarea 
                                name="historico_patologico" 
                                value={ficha.historico_patologico} 
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-section">
                            <label>Medicamentos em Uso</label>
                            <textarea 
                                name="medicamentos_uso" 
                                value={ficha.medicamentos_uso} 
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>

                        <div className="form-section alert-bg">
                            <label className="alert-label"><AlertCircle size={16}/> Alergias</label>
                            <textarea 
                                name="alergias" 
                                value={ficha.alergias} 
                                onChange={handleChange}
                                placeholder="Nega alergias conhecidas..."
                                rows="3"
                            />
                        </div>

                        <div className="form-section">
                            <label>Hábitos de Vida / Histórico Familiar</label>
                            <textarea 
                                name="historico_familiar" 
                                value={ficha.historico_familiar} 
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                        
                        <div className="form-section full-width">
                            <label>Observações Gerais</label>
                            <textarea 
                                name="observacoes" 
                                value={ficha.observacoes} 
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                    </div>

                    <div className="anamnese-footer">
                        <BotaoVoltar />
                        <button type="submit" className="btn-save-bottom" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </Container>
        </div>
    );
}