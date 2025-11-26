import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "@/context/sessionContext";
import { useRouter } from "next/navigation";
import "../../styles/nav.css"
import supabase from "../../../utils/supabase/client";

export default function NavBar() {
    const { session } = useContext(SessionContext)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
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
                if (data) setData(data);
                
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

    const avatarUrl = data?.avatar_url || session?.user?.user_metadata?.avatar_url;

    return (
        <nav>
            <img className="logo" src="/quicktreatFull.png" alt="Logo QuickTreat" onClick={() => router.push(`/${session.user.user_metadata.role}`)}/>

            {session ? (
                <div className="containerProfile">
                    {avatarUrl ? (
                        <img className="pfp" src={avatarUrl} alt="Perfil" />
                    ) : (
                        <div className="pfp"></div>
                    )}

                    <div className="name" onClick={handleClick}>
                        {data?.nome || "Usuário"}
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