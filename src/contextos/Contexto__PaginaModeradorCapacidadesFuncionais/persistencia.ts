import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

import { useToast } from 'Hooks/useToast';
import { atualizaCapacidadeFuncional, criaCapacidadeFuncional, desativaCapacidadeFuncional, obtemDetalheCapacidadeFuncional, reativaCapacidadeFuncional } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { criaFormularioCapacidadeFuncionalPorDetalhe, criaFormularioCapacidadeFuncionalVazio, montaPayloadCreateCapacidadeFuncional, montaPayloadUpdateCapacidadeFuncional, type FormularioCapacidadeFuncional } from './formulario';
import { useListagemCapacidadesFuncionais } from './listagem';
import { useOpcoesCadastroCapacidadeFuncional } from './opcoes';

export function usePersistenciaCapacidadeFuncional() {
    const toast = useToast();
    const listagemCapacidadesFuncionais = useListagemCapacidadesFuncionais();
    const [formulario, setFormulario] = useState<FormularioCapacidadeFuncional>(criaFormularioCapacidadeFuncionalVazio);
    const opcoesCadastro = useOpcoesCadastroCapacidadeFuncional();
    const [carregandoDetalhe, setCarregandoDetalhe] = useState<string | null>(null);
    const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const modoFormulario: 'novo' | 'edicao' = formulario.id === null ? 'novo' : 'edicao';
    const podeSalvar = !salvando && formulario.key.trim().length > 0 && formulario.nome.trim().length > 0 && formulario.estrutura.naturezasFuncionais.length > 0;

    const novaCapacidade = useCallback(() => {
        setFormulario(criaFormularioCapacidadeFuncionalVazio());
        setErroDetalhe(null);
    }, []);

    const selecionaCapacidade = useCallback(async (idCapacidadeFuncional: number): Promise<void> => {
        setCarregandoDetalhe('Carregando capacidade funcional');
        setErroDetalhe(null);

        try {
            const detalhe = await obtemDetalheCapacidadeFuncional(idCapacidadeFuncional);
            setFormulario(criaFormularioCapacidadeFuncionalPorDetalhe(detalhe));
        } catch (error) {
            setErroDetalhe(error instanceof Error ? error.message : 'Falha ao carregar capacidade funcional.');
        } finally {
            setCarregandoDetalhe(null);
        }
    }, []);

    const salvaCapacidade = useCallback(async (): Promise<void> => {
        if (!podeSalvar) return;

        setSalvando(true);

        try {
            const detalhe = formulario.id === null ? await criaCapacidadeFuncional(montaPayloadCreateCapacidadeFuncional(formulario)) : await atualizaCapacidadeFuncional(montaPayloadUpdateCapacidadeFuncional(formulario));
            setFormulario(criaFormularioCapacidadeFuncionalPorDetalhe(detalhe));
            listagemCapacidadesFuncionais.recarregar();
            await toast.sucesso('Capacidade salva', 'A capacidade funcional foi persistida.');
        } catch (error) {
            await toast.erro('Falha ao salvar capacidade', error instanceof Error ? error.message : 'Falha ao salvar capacidade funcional.');
        } finally {
            setSalvando(false);
        }
    }, [formulario, listagemCapacidadesFuncionais, podeSalvar, toast]);

    const desativaSelecionada = useCallback(async (): Promise<void> => {
        if (formulario.id === null) return;

        const detalhe = await desativaCapacidadeFuncional(formulario.id);
        setFormulario(criaFormularioCapacidadeFuncionalPorDetalhe(detalhe));
        listagemCapacidadesFuncionais.recarregar();
    }, [formulario.id, listagemCapacidadesFuncionais]);

    const reativaSelecionada = useCallback(async (): Promise<void> => {
        if (formulario.id === null) return;

        const detalhe = await reativaCapacidadeFuncional(formulario.id);
        setFormulario(criaFormularioCapacidadeFuncionalPorDetalhe(detalhe));
        listagemCapacidadesFuncionais.recarregar();
    }, [formulario.id, listagemCapacidadesFuncionais]);

    return useMemo(() => ({ listagemCapacidadesFuncionais, formulario, setFormulario, modoFormulario, podeSalvar, novaCapacidade, selecionaCapacidade, salvaCapacidade, desativaSelecionada, reativaSelecionada, carregandoDetalhe, erroDetalhe, salvando, ...opcoesCadastro }), [carregandoDetalhe, desativaSelecionada, erroDetalhe, formulario, listagemCapacidadesFuncionais, modoFormulario, novaCapacidade, opcoesCadastro, podeSalvar, reativaSelecionada, salvaCapacidade, salvando, selecionaCapacidade]);
};

export type SetFormularioCapacidadeFuncional = Dispatch<SetStateAction<FormularioCapacidadeFuncional>>;
