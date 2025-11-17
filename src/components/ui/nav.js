import React from "react";
import { useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import { useRouter } from "next/navigation";
import "../../styles/nav.css"
import supabase from "../../../utils/supabase/client";


export default function NavBar() {

    const { session } = useContext(SessionContext)
    const router = useRouter()
    const handleClick = () => {
        router.push("/perfilPaciente")
    }

    const exitButton = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <div>
            {session ? (
                <nav>
                    <div className="containerProfile">
                        <img className="pfp"></img  >
                        <div className ="name" onClick={handleClick}>{session.user.user_metadata.nome}</div>
                        <div className="exitButton" onClick={exitButton}> Sair </div>
                    </div>
                    <img className="logo" src="/quicktreatFull.png" />
                </nav>
            ) : (
                <nav><img></img><div className="name">Não logado</div></nav>
            )}
        </div>
    );
}