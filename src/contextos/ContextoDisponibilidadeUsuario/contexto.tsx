'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DiaDaSemana, DisponibilidadesDDS, DisponibilidadeUsuarioDto, JanelaDisponibilidade, ListaDisponibilidadesUsuario } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { me_salvaDisponibilidade, obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { adicionarDisponibilidadeComValidacao } from 'Uteis/LogicaAdicaoJanelaDisponibilidade/LogicaAdicaoJanelaDisponibilidade';

interface ContextoDisponibilidadeUsuarioProps {
    minhaDisponibilidade: DisponibilidadeUsuarioDto | null;
    listaDisponibilidadeEmAtualizacao: ListaDisponibilidadesUsuario | null;
    inicializaDisponibilidadeEmAtualizacao: () => ListaDisponibilidadesUsuario;
    limpaDisponibilidadeEmAtualizacao: () => void;
    adicionarDisponibilidade: (diaDaSemana: DiaDaSemana, janelaDisponibilidade: JanelaDisponibilidade) => string | null;
    removerDisponibilidade: (diaDaSemana: DiaDaSemana, janelaParaRemover: JanelaDisponibilidade) => string | null;
    salvarDisponibilidades: () => void;
    podeSalvar: boolean;
};

const ContextoDisponibilidadeUsuario = createContext<ContextoDisponibilidadeUsuarioProps | undefined>(undefined);

export const useContextoDisponibilidadeUsuario = (): ContextoDisponibilidadeUsuarioProps => {
    const context = useContext(ContextoDisponibilidadeUsuario);
    if (!context) throw new Error('useContextoDisponibilidadeUsuario precisa estar dentro de um ContextoDisponibilidadeUsuario');
    return context;
};

export const ContextoDisponibilidadeUsuarioProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [carregando, setCarregando] = useState<string | null>('');
    const [minhaDisponibilidade, setMinhaDisponibilidade] = useState<DisponibilidadeUsuarioDto | null>(null);
    const [listaDisponibilidadeEmAtualizacao, setListaDisponibilidadeEmAtualizacao] = useState<ListaDisponibilidadesUsuario | null>(null);

    const temElementos = listaDisponibilidadeEmAtualizacao
        ? listaDisponibilidadeEmAtualizacao.reduce((total, item) => total + (item.disponibilidades?.length || 0), 0)
        : 0;

    const podeSalvar: boolean = temElementos > 0;

    async function buscaDisponibilidades() {
        setCarregando('Buscando suas Disponibilidades');

        try {
            setMinhaDisponibilidade(await obtemDadosMinhasDisponibilidades());
        } catch {
            setMinhaDisponibilidade(null);
        } finally {
            setCarregando(null);
        }
    };

    function obtemNovaInstanciaDisponibilidade(): ListaDisponibilidadesUsuario {
        return Object.values(DiaDaSemana).filter(value => typeof value === 'number').map(dds => ({
            dds: dds as DiaDaSemana,
            disponibilidades: minhaDisponibilidade && minhaDisponibilidade?.disponibilidades
                ? minhaDisponibilidade?.disponibilidades.find(disponibilidadeDDS => disponibilidadeDDS.dds == dds)!.disponibilidades
                : [],
        }));
    };

    const inicializaDisponibilidadeEmAtualizacao = (): ListaDisponibilidadesUsuario => {
        const edicaoDeDisponibilidade = obtemNovaInstanciaDisponibilidade();
        setListaDisponibilidadeEmAtualizacao(edicaoDeDisponibilidade);

        return edicaoDeDisponibilidade;
    };

    function limpaDisponibilidadeEmAtualizacao() {
        setListaDisponibilidadeEmAtualizacao(null);
    };

    function adicionarDisponibilidade(diaDaSemana: DiaDaSemana, janelaDisponibilidade: JanelaDisponibilidade): string | null {
        if (!listaDisponibilidadeEmAtualizacao) return 'Lista de disponibilidade não inicializada';

        const resultado = adicionarDisponibilidadeComValidacao(listaDisponibilidadeEmAtualizacao, diaDaSemana, janelaDisponibilidade);

        setListaDisponibilidadeEmAtualizacao(resultado.novaLista);
        return resultado.mensagemAlerta;
    };

    const removerDisponibilidade = (diaDaSemana: DiaDaSemana, janelaParaRemover: JanelaDisponibilidade): string | null => {
        try {
            setListaDisponibilidadeEmAtualizacao(prev => {
                const novaLista = prev!.map(item => {
                    if (item.dds === diaDaSemana) return {
                        ...item,
                        disponibilidades: item.disponibilidades.filter(janela => !(janela.horaInicio === janelaParaRemover.horaInicio && janela.horaFim === janelaParaRemover.horaFim))
                    };

                    return item;
                });

                return novaLista;
            });

            return null;
        } catch (error) {
            return "Erro ao remover disponibilidade";
        }
    };

    async function salvarDisponibilidades() {
        await me_salvaDisponibilidade(listaDisponibilidadeEmAtualizacao!);

        window.location.reload();
    }

    useEffect(() => {
        buscaDisponibilidades();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoDisponibilidadeUsuario.Provider value={{ minhaDisponibilidade, listaDisponibilidadeEmAtualizacao, inicializaDisponibilidadeEmAtualizacao, limpaDisponibilidadeEmAtualizacao, adicionarDisponibilidade, removerDisponibilidade, salvarDisponibilidades, podeSalvar }}>
            {children}
        </ContextoDisponibilidadeUsuario.Provider>
    );
};