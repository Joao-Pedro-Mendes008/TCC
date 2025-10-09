import React from "react";
import { useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import { useRouter } from "next/navigation";
import "../../styles/nav.css"
import supabase from "../../../supabase/client";

export default function NavBar() {

    const { session } = useContext(SessionContext)
    const router = useRouter()
    const handleClick = () => {
        router.push("/perfilPaciente")
    }

    const logout = async () => {
        await supabase.auth.signOut().then(router.push("/signIn"))
    }

    return (
        <div>
            {session ? (
                <nav>
                    <img className="logo" src="/quicktreatFull.png" />
                    <div className="containerProfile">
                        <div className="exitButton" onClick={logout}> Sair </div>
                        <div className="name" onClick={handleClick}>{session.user.user_metadata.name}</div>
                        <img className="pfp"></img  >
                    </div>

                </nav>
            ) : (
                <nav><img></img><div className="name">Não logado</div></nav>
            )}
        </div>
    );
}