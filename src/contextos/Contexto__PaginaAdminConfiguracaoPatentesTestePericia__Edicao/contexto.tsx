'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { projetaConfiguracaoPatentesTestePericia, type ConfiguracaoPatentesTestePericia, type ConfiguracaoPatentesTestePericiaProjetada, type LinhaPreviewConfiguracaoPatenteTestePericia } from 'types-nora-api';

import SPA__PaginaAdminConfiguracaoPatentesTestePericia__Edicao from 'Conteineres/PaginaAdminConfiguracaoPatentesTestePericia/paginas/SPA__PaginaAdminConfiguracaoPatentesTestePericia__Edicao/SPA__PaginaAdminConfiguracaoPatentesTestePericia__Edicao';
import { useToast } from 'Hooks/useToast';
import { salvaConfiguracaoPatentesTestePericia } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props } from '../Contexto__PaginaAdminConfiguracaoPatentesTestePericia/contexto';

export type LinhaEdicaoPatenteTestePericia = LinhaPreviewConfiguracaoPatenteTestePericia & {
    nomePatente: string;
};

interface Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Props {
    linhas: LinhaEdicaoPatenteTestePericia[];
    configuracaoDisponivel: boolean;
    salvando: boolean;
    erro: string | null;
    alterarIncremento: (idPatentePericia: number, campo: 'incrementoValorMinimo' | 'incrementoValorMaximo', valor: number) => void;
    salvarConfiguracao: () => Promise<void>;
};

const Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao = createContext<Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao = (): Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Props => {
    const context = useContext(Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao);
    if (!context) throw new Error('useContexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao precisa estar dentro de um Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao');
    return context;
};

export const Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao__Provider = ({ estado }: { estado: Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Props; }) => {
    const toast = useToast();
    const [configuracaoProjetada, setConfiguracaoProjetada] = useState<ConfiguracaoPatentesTestePericiaProjetada | null>(estado.configuracaoInicial);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        setConfiguracaoProjetada(estado.configuracaoInicial);
    }, [estado.configuracaoInicial]);

    const linhas = useMemo<LinhaEdicaoPatenteTestePericia[]>(() => {
        if (!configuracaoProjetada) return [];
        const nomesPorId = new Map(estado.patentes.map(patente => [patente.id, patente.nome]));
        return configuracaoProjetada.linhas.map(linha => ({ ...linha, nomePatente: nomesPorId.get(linha.idPatentePericia) ?? `Patente ${linha.idPatentePericia}` }));
    }, [configuracaoProjetada, estado.patentes]);

    const alterarIncremento = useCallback((idPatentePericia: number, campo: 'incrementoValorMinimo' | 'incrementoValorMaximo', valor: number) => {
        if (!configuracaoProjetada) return;
        const configuracao: ConfiguracaoPatentesTestePericia = { patentes: configuracaoProjetada.configuracao.patentes.map(patente => patente.idPatentePericia === idPatentePericia ? { ...patente, [campo]: valor } : patente) };

        try {
            setConfiguracaoProjetada(projetaConfiguracaoPatentesTestePericia(configuracao));
            setErro(null);
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Configuracao invalida';
            setErro(mensagem);
            void toast.erro('Configuracao invalida', mensagem);
        }
    }, [configuracaoProjetada, toast]);

    const salvarConfiguracao = useCallback(async () => {
        if (!configuracaoProjetada) return;
        setSalvando(true);
        setErro(null);

        try {
            setConfiguracaoProjetada(await salvaConfiguracaoPatentesTestePericia({ configuracao: configuracaoProjetada.configuracao }));
            void toast.sucesso('Configuracao salva', 'Os proximos testes de pericia ja usam os impactos de patente atualizados.');
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Falha ao salvar configuracao';
            setErro(mensagem);
            void toast.erro('Falha ao salvar configuracao', mensagem);
        } finally {
            setSalvando(false);
        }
    }, [configuracaoProjetada, toast]);

    return (
        <Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao.Provider value={{ linhas, configuracaoDisponivel: configuracaoProjetada !== null, salvando, erro, alterarIncremento, salvarConfiguracao }}>
            <SPA__PaginaAdminConfiguracaoPatentesTestePericia__Edicao />
        </Contexto__PaginaAdminConfiguracaoPatentesTestePericia__Edicao.Provider>
    );
};