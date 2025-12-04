"use client"
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import { useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import {
    getConsultaById,
    cancelarConsulta,
    realizarConsulta,
    confirmarConsulta,
    desconfirmarConsulta,
} from "@/hooks/consultas";
import { Trash2, Check, CheckCheck, Clock } from 'lucide-react';
import "@/styles/consulta.css"
import BotaoVoltar from "@/components/ui/botaoVoltar";

function ConteudoConsulta() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idConsulta = searchParams.get("id");
    const {session} = useContext(SessionContext);

    const idConsultorioLogado = session?.user.id; 

    const [consulta, setConsulta] = useState(null);
    const [loadingDados, setLoadingDados] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [erroPermissao, setErroPermissao] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            if (!idConsulta || !idConsultorioLogado) return;
            
            setLoadingDados(true);
            
            const { data, error } = await getConsultaById(idConsulta, idConsultorioLogado);
            
            if (error || !data) {
                setErroPermissao(true);
            } else {
                setConsulta(data);
            }
            
            setLoadingDados(false);
        };

        carregarDados();
    }, [idConsulta, idConsultorioLogado]);

    const atualizarStatusLocal = (novoStatus) => {
        setConsulta((prev) => ({ ...prev, status: novoStatus }));
    };

    const handleConfirmar = async () => {
        setLoadingAction(true);
        const { error } = await confirmarConsulta(idConsulta);
        setLoadingAction(false);
        if (error) alert("Erro: " + error.message);
        else atualizarStatusLocal("Confirmada");
    };

    const handleRealizar = async () => {
        if (!confirm("Confirmar que a consulta foi realizada?")) return;
        setLoadingAction(true);
        const { error } = await realizarConsulta(idConsulta);
        setLoadingAction(false);
        if (error) alert("Erro: " + error.message);
        else atualizarStatusLocal("Realizada");
    };

    const handleDesconfirmar = async () => {
        setLoadingAction(true);
        const { error } = await desconfirmarConsulta(idConsulta);
        setLoadingAction(false);
        if (error) alert("Erro: " + error.message);
        else atualizarStatusLocal("Pendente");
    };

    const handleExcluir = async () => {
        if (!confirm("Tem certeza que deseja cancelar/excluir esta consulta?")) return;
        setLoadingAction(true);
        const { error } = await cancelarConsulta(idConsulta);
        if (error) {
            alert("Erro ao cancelar: " + error.message);
            setLoadingAction(false);
        } else {
            router.back(); 
        }
    };

    if (loadingDados) return <div className="p-10 text-center">Carregando dados...</div>;
    
    if (erroPermissao || !consulta) {
        return (
            <Container>
                <p className="text-red-500 font-bold">Consulta não encontrada ou acesso negado.</p>
                <p className="text-sm text-gray-500">Este paciente pode não estar vinculado ao seu consultório.</p>
                <BotaoVoltar />
            </Container>
        );
    }

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Detalhes da Consulta</h3>
            </div>

            <div className="card-consulta">
                <h3 className="nome-paciente">
                    Paciente: {consulta.usuarios?.nome_completo}
                </h3>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p><strong>Status Atual:</strong> <span className={`status-badge ${consulta.status.toLowerCase()}`}>{consulta.status}</span></p>
                    <p><strong>Procedimento:</strong> {consulta.procedimentos?.nome_procedimento} - R${consulta.procedimentos?.preco}</p>
                    <p><strong>Data:</strong> {consulta.data_consulta ? new Date(consulta.data_consulta).toLocaleDateString() : '-'}</p>
                    <p><strong>Horário:</strong> {consulta.horario}</p>
                    <p><strong>Descrição:</strong> {consulta.desc || "Sem observações"}</p>
                </div>

                <div className="detalhes-paciente">
                    <p><strong>Telefone:</strong> {consulta.usuarios?.telefone}</p>
                    <p><strong>Email:</strong> {consulta.usuarios?.email}</p>
                </div>

                <div className="botoes" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        className="realizar-consulta"
                        onClick={handleRealizar}
                        disabled={loadingAction || consulta.status === 'Realizada'}
                    >
                        {consulta.status === 'Realizada' ? "Já Realizada" : "Realizar"}
                        <CheckCheck size={18} />
                    </button>
                    <button
                        className="confirmar-consulta"
                        onClick={handleConfirmar}
                        disabled={loadingAction || consulta.status === 'Confirmada' || consulta.status === 'Realizada'}
                    >
                        {consulta.status === 'Confirmada' ? "Confirmada" : "Confirmar"}
                        <Check size={18} />
                    </button>
                    <button
                        className="desconfirmar-consulta"
                        onClick={handleDesconfirmar}
                        disabled={loadingAction || consulta.status === 'Pendente'}
                    >
                        Desconfirmar
                        <Clock size={18} />
                    </button>

                    <button
                        className="cancelar-consulta"
                        onClick={handleExcluir}
                        disabled={loadingAction}
                    >
                        Cancelar
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <BotaoVoltar />
        </Container>
    );
}

export default function TelaConsulta() {
    return (
        <div>
            <NavBar />
            <Suspense fallback={<div className="p-10 text-center">Carregando interface...</div>}>
                <ConteudoConsulta />
            </Suspense>
        </div>
    )
}