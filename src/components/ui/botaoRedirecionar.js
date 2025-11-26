"use client"

import { useRouter } from "next/navigation";
import "@/styles/components/botaoRedirecionar.css"

export default function BotaoRedirecionar({
    texto,
    url,
}) {
    const router = useRouter();

    const handleClick = () => {
        router.push(url);
    };

    return (
        <button
            onClick={handleClick}
            className={`botao-redirecionar`}
        >
            {texto}
        </button>
    );
}
