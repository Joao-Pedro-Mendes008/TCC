import React, { useContext } from "react";
import { SessionContext } from "@/context/sessionContext";
import { useRouter } from "next/navigation";
import "../../styles/nav.css"
import supabase from "../../../utils/supabase/client";

export default function NavBar() {
    const { session } = useContext(SessionContext)
    const router = useRouter()
    
    const handleClick = () => {
        if(session?.user?.user_metadata?.role) {
             router.push(`/${session.user.user_metadata.role}/perfil`)
        }
    }

    const exitButton = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    const avatarUrl = session?.user?.user_metadata?.avatar_url;

    return (
        <nav>
            <img className="logo" src="/quicktreatFull.png" alt="Logo QuickTreat" />

            {session ? (
                <div className="containerProfile">
                    {avatarUrl ? (
                        <img className="pfp" src={avatarUrl} alt="Perfil" />
                    ) : (
                        <div className="pfp"></div>
                    )}

                    <div className="name" onClick={handleClick}>
                        {session.user.user_metadata.nome || "Usuário"}
                    </div>
                    
                    <div className="exitButton" onClick={exitButton}>
                        Sair
                    </div>
                </div>
            ) : (
                <div className="containerProfile" style={{ width: 'auto', paddingLeft: '2rem' }}>
                   <div className="name">Não logado</div>
                </div>
            )}
        </nav>
    );
}