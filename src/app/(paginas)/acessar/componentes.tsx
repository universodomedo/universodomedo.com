'use client';

import { PAGINAS } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RedirecionadorHref from 'Componentes/Elementos/RedirecionadorHref/RedirecionadorHref';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaAcessar } from 'Conteineres/PaginaAcessar/conteiner';
import { leDestinoPosLogin } from 'Funcionalidades/Acessos/destinoPosLogin';

export function PaginaAcessar_Client() {
    const { estaAutenticado } = useContextoAutenticacao();

    // Links de email (verificação/recuperação) apontam para cá e precisam processar MESMO com sessão ativa (ex.: legado logado via Discord verificando o vínculo) — só redireciona quando não há token na URL.
    const temTokenDeEmailNaUrl = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).has('token') || new URLSearchParams(window.location.search).has('recuperacao'));

    // Quem foi barrado numa página protegida volta para ela assim que a sessão existe.
    const destinoPosLogin = leDestinoPosLogin();
    if (estaAutenticado && !temTokenDeEmailNaUrl && destinoPosLogin !== null) return <RedirecionadorHref href={destinoPosLogin} />

    if (estaAutenticado && !temTokenDeEmailNaUrl) return <RedirecionadorInterno pagina={PAGINAS.minhaPagina} />

    return (
        <ControladorSlot pagina={PAGINAS.acessar}>
            <Conteiner__PaginaAcessar />
        </ControladorSlot>
    );
};