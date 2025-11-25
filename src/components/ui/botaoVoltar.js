import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/styles/components/botaoVoltar.css";

export default function BotaoVoltar() {
    const router = useRouter();
    
    return(
        <button className="botao-voltar" onClick={() => router.back()}>
            <ArrowLeft />
            Voltar
        </button>
    )
}