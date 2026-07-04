'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AcessoTipoPagina, DadosCriarPaginaNavegacao, MenuDoBancoDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { obtemNavegacaoDoBanco } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import SPA__PaginaAdminGestaoNavegacao__NovaPagina from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__NovaPagina/SPA__PaginaAdminGestaoNavegacao__NovaPagina';

export type FormNovaPagina = {
    chave: string;
    template: string;
    label: string;
    acessoTipo: AcessoTipoPagina;
    acessoCapacidades: string[];
    comCabecalho: boolean;
    acessoPorMenuInterno: boolean;
    temLayout: boolean;
    layoutTitulo: string;
    layoutProporcaoConteudo: number;
    prioridadePresenca: number | null;
    idMusicaPagina: number | null;
    menuAlvoId: number | null;
    grupoPaiId: number | null;
    tituloItem: string;
};

const FORM_INICIAL: FormNovaPagina = {
    chave: '', template: '', label: '',
    acessoTipo: 'publico', acessoCapacidades: [],
    comCabecalho: false, acessoPorMenuInterno: false,
    temLayout: false, layoutTitulo: '', layoutProporcaoConteudo: 100,
    prioridadePresenca: null, idMusicaPagina: null,
    menuAlvoId: null, grupoPaiId: null, tituloItem: '',
};

interface Contexto__PaginaAdminGestaoNavegacao__NovaPagina__Props {
    form: FormNovaPagina;
    menus: MenuDoBancoDto[];
    salvando: boolean;
    erro: string | null;
    podeSalvar: boolean;
    setCampo: <K extends keyof FormNovaPagina>(campo: K, valor: FormNovaPagina[K]) => void;
    criar: () => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    criarPagina: (dados: DadosCriarPaginaNavegacao) => Promise<void>;
    cancelarCriacao: () => void;
};

const Contexto__PaginaAdminGestaoNavegacao__NovaPagina = createContext<Contexto__PaginaAdminGestaoNavegacao__NovaPagina__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__NovaPagina = (): Contexto__PaginaAdminGestaoNavegacao__NovaPagina__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__NovaPagina);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__NovaPagina precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__NovaPagina');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__NovaPagina__Provider = ({ criarPagina, cancelarCriacao }: PropsProvider) => {
    const [form, setForm] = useState<FormNovaPagina>(FORM_INICIAL);
    const [menus, setMenus] = useState<MenuDoBancoDto[]>([]);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);

    // Menus disponíveis para colocar a página (seletor de menu + grupo pai). Carregados uma vez.
    useEffect(() => { let ativo = true; obtemNavegacaoDoBanco().then(lista => { if (ativo) setMenus(lista); }).catch(() => { if (ativo) setMenus([]); }); return () => { ativo = false; }; }, []);

    // Navegação contextual: título estável (da PÁGINA); subtítulo detalha; o X (fecharProps) cancela a criação. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Nova Página',
        fecharProps: { tipo: 'acao', executar: cancelarCriacao, tituloTooltip: 'Cancelar' },
    });

    const setCampo = useCallback(<K extends keyof FormNovaPagina>(campo: K, valor: FormNovaPagina[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const podeSalvar = form.chave.trim().length > 0 && form.template.trim().length > 0 && form.label.trim().length > 0 && (form.acessoTipo !== 'capacidades' || form.acessoCapacidades.length > 0) && !salvando;

    const criar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            const colocacaoMenu = form.menuAlvoId !== null
                ? { fkMenusId: form.menuAlvoId, fkMenusNosId: form.grupoPaiId, tituloItem: form.tituloItem.trim().length > 0 ? form.tituloItem.trim() : null }
                : null;
            const dados: DadosCriarPaginaNavegacao = {
                chave: form.chave.trim(),
                template: form.template.trim(),
                label: form.label.trim(),
                acessoTipo: form.acessoTipo,
                acessoCapacidades: form.acessoTipo === 'capacidades' ? form.acessoCapacidades : null,
                comCabecalho: form.comCabecalho,
                acessoPorMenuInterno: form.acessoPorMenuInterno,
                temLayout: form.temLayout,
                layoutTitulo: form.temLayout ? (form.layoutTitulo.trim().length > 0 ? form.layoutTitulo.trim() : null) : null,
                layoutProporcaoConteudo: form.temLayout ? form.layoutProporcaoConteudo : null,
                prioridadePresenca: form.prioridadePresenca,
                idMusicaPagina: form.idMusicaPagina,
                colocacaoMenu,
            };
            await criarPagina(dados);
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível criar a página.');
        } finally {
            setSalvando(false);
        }
    }, [form, criarPagina]);

    return (
        <Contexto__PaginaAdminGestaoNavegacao__NovaPagina.Provider value={{ form, menus, salvando, erro, podeSalvar, setCampo, criar, cancelar: cancelarCriacao }}>
            <SPA__PaginaAdminGestaoNavegacao__NovaPagina />
        </Contexto__PaginaAdminGestaoNavegacao__NovaPagina.Provider>
    );
};
