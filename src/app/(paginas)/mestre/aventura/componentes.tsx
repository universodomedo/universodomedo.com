'use client';

import styles from './styles.module.css';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { encerraGrupoAventura, encerrarSessaoEmAndamentoDeGrupoAventura, salvaProximaSessaoDeGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { AventuraEstado, EstadoSessao } from 'types-nora-api';

export function PaginaMestreAventura_Slot() {
    return (
        <CabecalhoMestreAventura />
    );
};

function CabecalhoMestreAventura() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();

    const executaEncerraGrupoAventura = async () => {
        await encerraGrupoAventura(aventuraSelecionada.gruposAventura![0].id);
        window.location.reload();
    }

    return (
        <>
            <SecaoDeConteudo id={styles.recipiente_capa_pagina_aventura_mestre}>
                <div id={styles.recipiente_imagem_capa_pagina_aventura_mestre}>
                    <RecipienteImagem src={aventuraSelecionada.imagemCapa?.fullPath} />
                </div>
            </SecaoDeConteudo>

            {aventuraSelecionada.gruposAventura![0].estadoAtual === AventuraEstado.FINALIZADA ? (
                <SecaoAventuraFinalizada />
            ) : aventuraSelecionada.gruposAventura![0].estadoAtual === AventuraEstado.EM_ANDAMENTO ? (
                <SecaoAventuraEmAndamento />
            ) : aventuraSelecionada.gruposAventura![0].estadoAtual === AventuraEstado.EM_PREPARO ? (
                <></>
            ) : (
                <></>
            )}
        </>
        // <div id={styles.recipiente_dados_pagina_aventura_mestre}>
        //     <button onClick={executaEncerraGrupoAventura}>Encerrar Aventura</button>
        // </div>
    );
};

function SecaoAventuraFinalizada() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <SecaoDeConteudo>
            <p>Data Criação: {aventuraSelecionada.dataCriacao.toString()}</p>
            {/* <p>Data Início: {aventuraSelecionada.dataCriacao.toString()}</p> */}
            <p>Data Fim: {aventuraSelecionada.dataFimAventura?.toString()}</p>
        </SecaoDeConteudo>
    );
};

function SecaoAventuraEmAndamento() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();

    const executaEncerrarSessaoEmAndamentoDeGrupoAventura = async () => {
        await encerrarSessaoEmAndamentoDeGrupoAventura(aventuraSelecionada.gruposAventura![0].id);
        window.location.reload();
    }

    const executaSalvaProximaSessaoDeGrupoAventura = async () => {
        await salvaProximaSessaoDeGrupoAventura(aventuraSelecionada.gruposAventura![0].id);
        window.location.reload();
    }

    return (
        <SecaoDeConteudo>
            <button disabled={aventuraSelecionada.gruposAventura![0].sessaoMaisRecente?.estadoAtual !== EstadoSessao.EM_ANDAMENTO} onClick={() => executaEncerrarSessaoEmAndamentoDeGrupoAventura()}>Finalizar Sessão em Aberto</button>
            <button disabled={aventuraSelecionada.gruposAventura![0].sessaoMaisRecente?.estadoAtual !== EstadoSessao.FINALIZADA} onClick={() => executaSalvaProximaSessaoDeGrupoAventura()}>Marcar Próxima Sessão</button>
        </SecaoDeConteudo>
    );
};