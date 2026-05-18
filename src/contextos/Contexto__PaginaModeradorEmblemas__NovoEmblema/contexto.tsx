'use client';

import { createContext, useContext, useMemo, useState, type ChangeEvent } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaModeradorEmblemas__Props } from '../Contexto__PaginaModeradorEmblemas/contexto';
import SPA__PaginaModeradorEmblemas__NovoEmblema from 'Conteineres/PaginaModeradorEmblemas/paginas/SPA__PaginaModeradorEmblemas__NovoEmblema/SPA__PaginaModeradorEmblemas__NovoEmblema';

type NovoEmblemaPayload = {
    readonly nome: string;
    readonly nomeVisual: string | null;
    readonly descricao: string;
};

interface Contexto__PaginaModeradorEmblemas__NovoEmblema__Props {
    nome: string;
    nomeVisual: string;
    descricao: string;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    alteraNome: (evento: ChangeEvent<HTMLInputElement>) => void;
    alteraNomeVisual: (evento: ChangeEvent<HTMLInputElement>) => void;
    alteraDescricao: (evento: ChangeEvent<HTMLTextAreaElement>) => void;
};

const Contexto__PaginaModeradorEmblemas__NovoEmblema = createContext<Contexto__PaginaModeradorEmblemas__NovoEmblema__Props | undefined>(undefined);

export const useContexto__PaginaModeradorEmblemas__NovoEmblema = (): Contexto__PaginaModeradorEmblemas__NovoEmblema__Props => {
    const context = useContext(Contexto__PaginaModeradorEmblemas__NovoEmblema);
    if (!context) throw new Error('useContexto__PaginaModeradorEmblemas__NovoEmblema precisa estar dentro de um Contexto__PaginaModeradorEmblemas__NovoEmblema');
    return context;
};

export const Contexto__PaginaModeradorEmblemas__NovoEmblema__Provider = ({ setEstaEmProcessoCriacao }: { setEstaEmProcessoCriacao: Contexto__PaginaModeradorEmblemas__Props['setEstaEmProcessoCriacao']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Criando novo registro', fecharProps: { tipo: 'acao', executar: () => setEstaEmProcessoCriacao(false), tituloTooltip: 'Voltar para Listagem' } });

    const [nome, setNome] = useState('');
    const [nomeVisual, setNomeVisual] = useState('');
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);

    const podeSalvar = useMemo(() => nome.trim().length > 0 && descricao.trim().length > 0 && !salvando, [nome, descricao, salvando]);

    function alteraNome(evento: ChangeEvent<HTMLInputElement>): void { setNome(evento.target.value); };

    function alteraNomeVisual(evento: ChangeEvent<HTMLInputElement>): void { setNomeVisual(evento.target.value); };

    function alteraDescricao(evento: ChangeEvent<HTMLTextAreaElement>): void { setDescricao(evento.target.value); };

    function montaPayload(): NovoEmblemaPayload {
        return {
            nome: nome.trim(),
            nomeVisual: nomeVisual.trim().length > 0 ? nomeVisual.trim() : null,
            descricao: descricao.trim(),
        };
    };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        setSalvando(true);

        try {
            console.log('Criar novo emblema', montaPayload());
        } finally {
            setSalvando(false);
        };
    };

    return (
        <Contexto__PaginaModeradorEmblemas__NovoEmblema.Provider value={{ nome, nomeVisual, descricao, salvando, podeSalvar, salvar, alteraNome, alteraNomeVisual, alteraDescricao }}>
            <SPA__PaginaModeradorEmblemas__NovoEmblema />
        </Contexto__PaginaModeradorEmblemas__NovoEmblema.Provider>
    );
};