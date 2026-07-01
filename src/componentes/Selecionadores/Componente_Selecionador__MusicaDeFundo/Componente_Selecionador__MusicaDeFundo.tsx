'use client';

import styles from './styles.module.css';

import { useEffect } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useDefinirMusicaSobreposicao } from 'Hooks/useDefinirMusicaPagina';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaSobreposicao } from 'Redux/selectors/audioPaginaSelectors';

// Seletor de Música de Fundo — instância do Componente_Selecionador com fonte GraphQL MusicaConfigurada (SÓ música já configurada no mixer; o id já é o tocável). Devolve { idMusicaConfigurada, nome } via aoConfirmar.
// REGRA: nenhum player próprio — o preview de cada música vai pra Central de Áudio como SOBREPOSIÇÃO (por cima); ao sair do seletor some (volta a música anterior).
export function Componente_Selecionador__MusicaDeFundo({ aoConfirmar, aoCancelar, idInicial = null }: { aoConfirmar: (idMusicaConfigurada: number, nome: string) => void | Promise<void>; aoCancelar?: () => void; idInicial?: number | null; }) {
    const definirSobreposicao = useDefinirMusicaSobreposicao();
    const idSobreposicao = useAppSelector(selectIdMusicaSobreposicao);

    const listagem = useNoraGraphQLListagem('MusicaConfigurada', {
        select: ['id', 'nome', { fonteMusica: ['nome'] }],
        itensPorPagina: 12,
        carregando: 'Buscando Músicas',
        mensagemErro: 'Houve um erro recuperando as Músicas',
        mensagemListaVazia: 'Nenhuma música configurada encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma música encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    // Ao sair do seletor (fechar/confirmar/cancelar), tira a sobreposição — o preview nunca vaza pra fora da página.
    useEffect(() => () => { definirSobreposicao(null, null); }, [definirSobreposicao]);

    function alternaPreview(id: number, nome: string): void {
        if (idSobreposicao === id) definirSobreposicao(null, null);
        else definirSobreposicao(id, nome);
    };

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={musica => musica.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={musica => (
                <div className={styles.item_musica}>
                    <button type="button" className={styles.botao_preview} onClick={evento => { evento.stopPropagation(); alternaPreview(musica.id, musica.nome); }} aria-label={idSobreposicao === musica.id ? 'Parar' : 'Ouvir'}>
                        {idSobreposicao === musica.id ? '❚❚' : '▶'}
                    </button>
                    <div className={styles.info}>
                        <strong className={styles.nome}>{musica.nome}</strong>
                        <span className={styles.fonte}>{musica.fonteMusica.nome}</span>
                    </div>
                </div>
            )}
            aoConfirmar={musica => aoConfirmar(musica.id, musica.nome)}
            aoCancelar={aoCancelar}
            idInicial={idInicial}
            textoConfirmar="Usar esta música"
        />
    );
};
