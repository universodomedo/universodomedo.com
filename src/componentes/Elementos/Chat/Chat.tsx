"use client";

import styles from "./styles.module.css";

import { useEffect, useState } from "react";

import { useContextoAutenticacao } from "Contextos/ContextoAutenticacao/contexto";
import { DivClicavel } from "../DivClicavel/DivClicavel";
import { getSocket } from "Hooks/useEventoWs";
import { useAppSelector } from "Redux/hooks/useRedux";
import type { RootState } from "Redux/store/types";
import ConteudoSalaSelecionada from "./componentes/ConteudoSalaSelecionada";
import ListaSalas from "./componentes/ListaSalas";

type WsStatus = "loading" | "ready" | "error";

export default function ComponenteChat() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const [aberto, setAberto] = useState(false);

    if (!carregando && !estaAutenticado) return;

    if (!aberto) return (<button id={styles.botao_abre_janela_chat} onClick={() => setAberto(true)}>💬</button>);

    return (
        <div id={styles.recipiente_corpo_chat}>
            <DivClicavel id={styles.icone_fechar_chat} onClick={() => setAberto(false)}>x</DivClicavel>
            <CorpoChat />
        </div>
    );
};

function CorpoChat() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const [wsStatus, setWsStatus] = useState<WsStatus>(() => { const s = getSocket(); return s && s.connected ? "ready" : "loading"; });
    const [wsError, setWsError] = useState<string | null>(null);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) { setWsStatus("error"); setWsError("Socket indisponível."); return; }

        if (socket.connected) { setWsStatus("ready"); setWsError(null); return; }

        setWsStatus("loading");
        setWsError(null);

        const onConnect = () => { setWsStatus("ready"); setWsError(null); };
        const onConnectError = (err: unknown) => { setWsStatus("error"); setWsError(`Falha no handshake: ${String(err)}`); };

        socket.on("connect", onConnect);
        socket.on("connect_error", onConnectError);

        const timeoutId = window.setTimeout(() => { if (!socket.connected) { setWsStatus("error"); setWsError("Timeout ao conectar no WebSocket."); } }, 10000);

        return () => {
            window.clearTimeout(timeoutId);
            socket.off("connect", onConnect);
            socket.off("connect_error", onConnectError);
        };
    }, []);

    if (carregando) return (<h2 id={styles.mensagem_chat_carregando}>Carregando autenticação..</h2>);

    if (wsStatus === "loading") return (<h2 id={styles.mensagem_chat_carregando}>Conectando ao chat em tempo real..</h2>);

    if (wsStatus === "error") return (<h2 id={styles.mensagem_chat_carregando}>Chat indisponível no momento. {wsError ? `(${wsError})` : ""}</h2>);

    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);
    if (estaAutenticado && (!usuarios || usuarios.length === 0)) return (<h2 id={styles.mensagem_chat_carregando}>Carregando salas e mensagens..</h2>);

    return (
        <>
            {/* {!estaAutenticado ? (<h2 id={styles.mensagem_chat_carregando}>Modo visitante: você pode ler o chat, mas precisa fazer login para enviar mensagens.</h2>) : null} */}
            <ConteudoSalaSelecionada />
            <ListaSalas />
        </>
    );
};