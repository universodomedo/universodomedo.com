'use client';

import { createContext, useContext, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__CriarEtiqueta from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__CriarEtiqueta/SPA__PaginaColaboradorPainelDoMedo__CriarEtiqueta';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Props {
    card: CardItem;
    nome: string;
    setNome: (nome: string) => void;
    cor: string;
    setCor: (cor: string) => void;
    corBorda: string;
    setCorBorda: (cor: string) => void;
    bordaTransparente: boolean;
    setBordaTransparente: (transparente: boolean) => void;
    salvando: boolean;
    criar: () => Promise<void>;
};

const Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta = createContext<Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta = (): Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: criar uma etiqueta no catalogo (nome + cor + cor de borda). Ao concluir/cancelar volta para aplicar-etiqueta (fecharOperacaoCard trata a transicao).
export const Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta__Provider = () => {
    const { cards, operacaoCard, salvando, criaEtiqueta, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [nome, setNome] = useState<string>('');
    const [cor, setCor] = useState<string>('#5aa9a3');
    const [corBorda, setCorBorda] = useState<string>('#EBE0C9');
    const [bordaTransparente, setBordaTransparente] = useState<boolean>(true);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const criar = async () => { if (!nome.trim()) return; await criaEtiqueta(nome, cor, bordaTransparente ? 'transparent' : corBorda); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta.Provider value={{ card, nome, setNome, cor, setCor, corBorda, setCorBorda, bordaTransparente, setBordaTransparente, salvando, criar }}>
            <SPA__PaginaColaboradorPainelDoMedo__CriarEtiqueta />
        </Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta.Provider>
    );
};
