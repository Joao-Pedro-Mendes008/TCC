import React from "react";
import { useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import { useRouter } from "next/navigation";
import "../../styles/nav.css"

export default function NavBar(){ 

    const { session } = useContext(SessionContext)
    const router = useRouter()
    const handleClick = () => {
        router.push("/perfilPaciente")
    }

    return (
        <div>
            {session ? (
                <nav>
                    <div className="containerProfile">
                        <img className="pfp"></img  >
                        <div className ="name" onClick={handleClick}>{session.user.user_metadata.name}</div>
                        <div className="exitButton"> Sair </div>
                    </div>
                    <img className="logo" src="/quicktreatFull.png" />
                </nav>
            ) : (
                <nav><img></img><h1>Não logado</h1></nav>
            )}
        </div>
    );
}