'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CaminhoArquivoAvatar } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { obtemAvataresDeComparacao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';


export interface ContextoGerenciarAvatares__Props {
    listagemPersonagens: ReturnType<typeof obtemListagemPersonagens>;
    avataresDeComparacao: CaminhoArquivoAvatar[];
    setIdPersonagemSelecionado: (v: number) => void;
    deselecionaPersonagem: () => void;
    personagemSelecionado: ReturnType<typeof obtemListagemPersonagens>['registros'][number] | null;
};

const ContextoGerenciarAvatares = createContext<ContextoGerenciarAvatares__Props | undefined>(undefined);

export const useContextoGerenciarAvatares = (): ContextoGerenciarAvatares__Props => {
    const context = useContext(ContextoGerenciarAvatares);
    if (!context) throw new Error('useContextoGerenciarAvatares precisa estar dentro de um ContextoGerenciarAvatares');
    return context;
};

export const ContextoGerenciarAvatares__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemPersonagens = obtemListagemPersonagens();

    const [carregando, setCarregando] = useState<string | null>(null);
    const [avataresDeComparacao, setAvataresDeComparacao] = useState<CaminhoArquivoAvatar[]>([]);
    const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);

    const personagemSelecionado = idPersonagemSelecionado ? listagemPersonagens.registros.find(personagem => personagem.id === idPersonagemSelecionado) ?? null : null;

    async function buscaAvataresDeComparacao() {
        setCarregando('Buscando Avatares de Comparação');

        try {
            setAvataresDeComparacao(await obtemAvataresDeComparacao());
        } catch {
            setAvataresDeComparacao([]);
            toast.erro('Houve um problema ao carregar os Avatares de Comparação');
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaPersonagem() { setIdPersonagemSelecionado(null); };

    useEffect(() => {
        buscaAvataresDeComparacao();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoGerenciarAvatares.Provider value={{ listagemPersonagens, avataresDeComparacao, setIdPersonagemSelecionado, deselecionaPersonagem, personagemSelecionado }}>
            {children}
        </ContextoGerenciarAvatares.Provider>
    );
};

//

export function obtemListagemPersonagens() {
    return useNoraGraphQLListagem('Personagem', {
        select: ['id', 'nome', 'usuario', 'tipoPersonagem', 'avatares'],
        itensPorPagina: 12,
        carregando: 'Buscando Personagens',
        mensagemErro: 'Houve um erro recuperando os Personagens existentes',
        mensagemListaVazia: 'Nenhum personagem encontrado.',
        mensagemListaVaziaComFiltro: 'Nenhuma personagem encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};