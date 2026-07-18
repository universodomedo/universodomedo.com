'use client';

import { createContext, useContext, useState } from 'react';

import { COLUNAS_PROCESSO_PAINEL_DO_MEDO, type MotivoTranca } from 'types-nora-api';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__TrancarCartao from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__TrancarCartao/SPA__PaginaColaboradorPainelDoMedo__TrancarCartao';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props {
    card: CardItem;
    totalEvidencias: number;
    motivo: MotivoTranca | null;
    setMotivo: (motivo: MotivoTranca | null) => void;
    salvando: boolean;
    trancar: () => Promise<void>;
    // Processo: nome da coluna atual quando ela NAO permite trancar (tranca so em EM_LEVANTAMENTO/CONCLUIDO); null = liberado.
    colunaBloqueante: string | null;
};

const Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao = createContext<Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao = (): Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: trancar o cartao com um motivo (Concluido/Interrompido). Trancado = nenhuma alteracao no cartao, nem pelo criador; destrancar fica na propria ficha (clique unico).
export const Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Provider = () => {
    const { cards, colunas, operacaoCard, salvando, trancaCard, anexosCard, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [motivo, setMotivo] = useState<MotivoTranca | null>(null);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    // Processo (contrato COLUNAS_PROCESSO_PAINEL_DO_MEDO): trancado o cartao nao se move mais — a tranca so e permitida em EM_LEVANTAMENTO ou CONCLUIDO; fora delas a SPA mostra o aviso e bloqueia (o backend valida igual).
    const colunaAtual = colunas.registros.find(item => item.id === card.fkColunasId) ?? null;
    const nomesPermitidos: string[] = [COLUNAS_PROCESSO_PAINEL_DO_MEDO.EM_LEVANTAMENTO.nome, COLUNAS_PROCESSO_PAINEL_DO_MEDO.CONCLUIDO.nome];
    const colunaBloqueante = colunaAtual && !nomesPermitidos.includes(colunaAtual.nome) ? colunaAtual.nome : null;

    const trancar = async () => { if (motivo === null || colunaBloqueante !== null) return; await trancaCard(card.id, motivo); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao.Provider value={{ card, totalEvidencias: anexosCard.length, motivo, setMotivo, salvando, trancar, colunaBloqueante }}>
            <SPA__PaginaColaboradorPainelDoMedo__TrancarCartao />
        </Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao.Provider>
    );
};
