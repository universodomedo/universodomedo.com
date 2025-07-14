import styles from './styles.module.css';
import cn from 'classnames';
import { ReactNode } from "react";

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';
import { TrailerGrupoAventura } from './subcomponentes';

export function CabecalhoGrupoAventura() {
    const { grupoAventuraSelecionado, sessaoSelecionada } = useContextoPaginaAventura();

    return (
        <ContainerFragmentoAssistindoSessao>
            <h1>{grupoAventuraSelecionado.titulo}</h1>
            {sessaoSelecionada && (<h3>{sessaoSelecionada.episodioPorExtenso}</h3>)}
        </ContainerFragmentoAssistindoSessao>
    );
};

export function CorpoGrupoAventura() {
    const { sessaoSelecionada } = useContextoPaginaAventura();

    return (
        <>
            {!sessaoSelecionada && (<TrailerGrupoAventura />)}
        </>
    );
};

export function ContainerFragmentoAssistindoSessao({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn(styles.recipiente_container_info_assistindo_grupo_aventura, className)}>
            {children}
        </div>
    );
};