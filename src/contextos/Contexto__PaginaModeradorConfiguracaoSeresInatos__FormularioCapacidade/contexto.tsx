'use client';

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import type { DTO__CREATE__CapacidadeInata } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaCapacidadeInata, editaCapacidadeInata as editaCapacidadeInataBackend } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade';
import { atualizaValorParametro, criaValoresFormulario, montaValoresParametros, type FormularioCapacidadeInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';
import { useListagemAcoesInatas, type RegistroCapacidadeInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Props {
    capacidadeInicial: RegistroCapacidadeInata | null;
    aoVoltar: () => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Valor {
    formularioCapacidade: FormularioCapacidadeInata;
    setFormularioCapacidade: Dispatch<SetStateAction<FormularioCapacidadeInata>>;
    listagemAcoes: ReturnType<typeof useListagemAcoesInatas>;
    idAcaoSelecionada: string;
    setIdAcaoSelecionada: Dispatch<SetStateAction<string>>;
    aoVoltar: () => void;
    adicionaAcaoSelecionada: () => void;
    removeAcaoCapacidade: (idAcaoInata: number) => void;
    atualizaParametroPadraoCapacidade: (idAcaoInata: number, chave: string, valor: string) => void;
    salvaCapacidade: () => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: props.capacidadeInicial ? props.capacidadeInicial.nome : 'Nova Capacidade Inata', fecharProps: { tipo: 'acao', executar: props.aoVoltar, tituloTooltip: 'Voltar para Listagem' } });

    const [formularioCapacidade, setFormularioCapacidade] = useState<FormularioCapacidadeInata>(() => criaFormularioCapacidade(props.capacidadeInicial));
    const [idAcaoSelecionada, setIdAcaoSelecionada] = useState('');
    const listagemAcoes = useListagemAcoesInatas();

    function adicionaAcaoSelecionada(): void {
        const idAcaoInata = Number(idAcaoSelecionada);
        if (!Number.isInteger(idAcaoInata) || idAcaoInata < 1) return;
        if (formularioCapacidade.acoes.some(acao => acao.idAcaoInata === idAcaoInata)) return;

        const acaoInata = listagemAcoes.registros.find(acao => acao.id === idAcaoInata && acao.ativo);
        if (!acaoInata) return;

        setFormularioCapacidade(formularioAtual => ({ ...formularioAtual, acoes: [...formularioAtual.acoes, { idAcaoInata: acaoInata.id, nomeAcao: acaoInata.nome, parametrosPadrao: criaValoresFormulario(acaoInata.parametros.itens, []) }] }));
        setIdAcaoSelecionada('');
    };

    function removeAcaoCapacidade(idAcaoInata: number): void {
        setFormularioCapacidade(formularioAtual => ({ ...formularioAtual, acoes: formularioAtual.acoes.filter(acao => acao.idAcaoInata !== idAcaoInata) }));
    };

    function atualizaParametroPadraoCapacidade(idAcaoInata: number, chave: string, valor: string): void {
        setFormularioCapacidade(formularioAtual => ({ ...formularioAtual, acoes: formularioAtual.acoes.map(acao => acao.idAcaoInata === idAcaoInata ? { ...acao, parametrosPadrao: atualizaValorParametro(acao.parametrosPadrao, chave, valor) } : acao) }));
    };

    async function salvaCapacidade(): Promise<void> {
        try {
            if (formularioCapacidade.id === null) await criaCapacidadeInata(montaPayloadCapacidade(formularioCapacidade));
            else await editaCapacidadeInataBackend({ ...montaPayloadCapacidade(formularioCapacidade), idCapacidadeInata: formularioCapacidade.id });

            await toast.sucesso(formularioCapacidade.id === null ? 'Capacidade inata criada' : 'Capacidade inata atualizada', formularioCapacidade.nome.trim());
            props.aoVoltar();
        } catch {
            await toast.erro('Falha ao salvar capacidade inata', 'Confira os campos e tente novamente.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade.Provider value={{ formularioCapacidade, setFormularioCapacidade, listagemAcoes, idAcaoSelecionada, setIdAcaoSelecionada, aoVoltar: props.aoVoltar, adicionaAcaoSelecionada, removeAcaoCapacidade, atualizaParametroPadraoCapacidade, salvaCapacidade }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade.Provider>
    );
};

function criaFormularioCapacidade(capacidadeInicial: RegistroCapacidadeInata | null): FormularioCapacidadeInata {
    if (!capacidadeInicial) return { id: null, nome: '', descricao: '', origemCorporal: '', quantidade: '', observacoes: '', acoes: [] };

    return {
        id: capacidadeInicial.id,
        nome: capacidadeInicial.nome,
        descricao: capacidadeInicial.descricao,
        origemCorporal: capacidadeInicial.origemCorporal,
        quantidade: capacidadeInicial.quantidade === null ? '' : String(capacidadeInicial.quantidade),
        observacoes: capacidadeInicial.observacoes,
        acoes: capacidadeInicial.acoes.itens.map(acao => ({ idAcaoInata: acao.acaoInata.id, nomeAcao: acao.acaoInata.nome, parametrosPadrao: criaValoresFormulario(acao.acaoInata.parametros, acao.parametrosPadrao) })),
    };
};

function montaPayloadCapacidade(formulario: FormularioCapacidadeInata): DTO__CREATE__CapacidadeInata {
    return {
        nome: formulario.nome.trim(),
        descricao: formulario.descricao.trim(),
        origemCorporal: formulario.origemCorporal.trim(),
        quantidade: resolveQuantidade(formulario.quantidade),
        observacoes: formulario.observacoes.trim(),
        acoes: formulario.acoes.map(acao => ({ idAcaoInata: acao.idAcaoInata, parametrosPadrao: montaValoresParametros(acao.parametrosPadrao, false) })),
    };
};

function resolveQuantidade(quantidadeTexto: string): number | null {
    const quantidadeNormalizada = quantidadeTexto.trim();
    if (quantidadeNormalizada.length === 0) return null;

    const quantidade = Number(quantidadeNormalizada);
    if (!Number.isFinite(quantidade)) throw new Error('Quantidade inválida.');

    return quantidade;
};