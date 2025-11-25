"use client"
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/components/ui/nav";
import Container from "@/components/ui/container";
import {
    getConsultaById,
    deleteConsulta,
    realizarConsulta,
    confirmarConsulta,
    desconfirmarConsulta,
} from "@/hooks/consultas";
import { Trash2, Check, CheckCheck, Clock } from 'lucide-react';
import "@/styles/consulta.css"
import BotaoVoltar from "@/components/ui/botaoVoltar";

export default function TelaConsulta() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idConsulta = searchParams.get("id");

    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [excluindo, setExcluindo] = useState(false);
    const [realizado, setRealizado] = useState(false);
    const [desconfirmado, setDesconfirmado] = useState(false);
    const [confirmado, setConfirmado] = useState(false);
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const carregarDados = async () => {
            if (!idConsulta) return;
            const { data, error } = await getConsultaById(idConsulta);
            if (!error) setConsulta(data);
            setLoading(false);
        };
        carregarDados();
    }, [idConsulta]);

    const handleConfirmar = async () => {
        if (!confirm("Tem certeza que deseja confirmar esta consulta?")) return;

        setConfirmado(true);

        const { error } = await confirmarConsulta(idConsulta);

        if (error) {
            alert("Erro ao confirmar: " + error.message);
            setConfirmado(false);
        } else {
            window.location.reload();
        }
    };

    const handleExcluir = async () => {
        if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;

        setExcluindo(true);

        const { error } = await deleteConsulta(idConsulta);

        if (error) {
            alert("Erro ao cancelar: " + error.message);
            setExcluindo(false);
        } else {
            window.location.reload();
        }
    };

    const handleRealizar = async () => {
        if (!confirm("Tem certeza que deseja realizar esta consulta?")) return;

        setRealizado(true);

        const { error } = await realizarConsulta(idConsulta);

        if (error) {
            alert("Erro ao realizar: " + error.message);
            setRealizado(false);
        } else {
            window.location.reload();
        }
    };

    const handleDesconfirmar = async () => {
        if (!confirm("Tem certeza que deseja desconfirmar esta consulta?")) return;

        setDesconfirmado(true);

        const { error } = await desconfirmarConsulta(idConsulta);

        if (error) {
            alert("Erro ao desconfirmar: " + error.message);
            setDesconfirmado(false);
        } else {
            window.location.reload();
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (!consulta) return <div>Consulta não encontrada.</div>;

    return (
        <div>
            <NavBar />
            <Container>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Detalhes da Consulta</h3>
                </div>

                <div className="card-consulta">
                    <h3 className="nome-paciente">
                        Paciente: {consulta.usuarios?.nome_completo}
                    </h3>


                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p><strong>Procedimento:</strong> {consulta.procedimentos?.nome_procedimento}</p>
                        <p><strong>Data:</strong> {new Date(consulta.data_consulta).toLocaleDateString()}</p>
                        <p><strong>Horário:</strong> {consulta.horario}</p>
                        <p><strong>Descrição:</strong> {consulta.desc || "Sem observações"}</p>
                    </div>

                    <div className="detalhes-paciente">
                        <p><strong>Telefone:</strong> {consulta.usuarios?.telefone}</p>
                        <p><strong>Email:</strong> {consulta.usuarios?.email}</p>
                    </div>
                    <div className="botoes" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            className="realizar-consulta"
                            onClick={handleRealizar}
                            disabled={realizado}
                        >
                            {realizado ? "Realizada" : "Marcar como Realizada"}
                            <CheckCheck />
                        </button>

                        <button
                            className="confirmar-consulta"
                            onClick={handleConfirmar}
                            disabled={confirmado}
                        >
                            {confirmado ? "Confirmada" : "Confirmar"}
                            <Check />
                        </button>

                        <button
                            className="desconfirmar-consulta"
                            onClick={handleDesconfirmar}
                            disabled={desconfirmado}
                        >
                            {desconfirmado ? "Desconfirmada" : "Desconfirmar"}
                            <Clock />
                        </button>

                        <button
                            className="cancelar-consulta"
                            onClick={handleExcluir}
                            disabled={excluindo}
                        >
                            {excluindo ? "Cancelada" : "Cancelar Consulta"}
                            <Trash2 />
                        </button>
                    </div>
                    <BotaoVoltar />
                </div>


            </Container>
        </div>
    )
}