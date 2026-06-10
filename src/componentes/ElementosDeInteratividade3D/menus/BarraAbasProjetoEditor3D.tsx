'use client';

import styles from './styles.module.css';

import { Cross2Icon } from '@radix-ui/react-icons';
import { type MouseEvent } from 'react';

import { abaProjeto3DTemAlteracaoNaoSalvaEditor3D, obtemAbasProjeto3DComAbaAtivaAtualEditor3D } from '../estado/editor3D.abasProjeto';
import { obtemBloqueioCarregamentoCenaCanonicaEditor3D } from '../editor/editor3D.cenaCanonica.carregamento';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { AbaProjeto3DEditor3D } from '../estado/editor3D.estado.types';

function obtemMensagemFecharAbaProjeto3D(aba: AbaProjeto3DEditor3D): string { return `A aba "${aba.nome}" tem alteracoes nao salvas. Fechar a aba vai descartar essas alteracoes. Deseja fechar mesmo assim?`; };

export function BarraAbasProjetoEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const abas = obtemAbasProjeto3DComAbaAtivaAtualEditor3D(estado);

    function trocaAba(aba: AbaProjeto3DEditor3D): void {
        if (aba.id === estado.idAbaProjeto3DAtiva) return;

        const motivoBloqueio = obtemBloqueioCarregamentoCenaCanonicaEditor3D(estado);

        if (motivoBloqueio !== null) {
            acoes.exibeNotificacaoAreaInterativa(motivoBloqueio);

            return;
        }

        acoes.trocaAbaProjeto3D(aba.id);
    };

    function fechaAba(event: MouseEvent<HTMLButtonElement>, aba: AbaProjeto3DEditor3D): void {
        event.preventDefault();
        event.stopPropagation();

        if (aba.id === estado.idAbaProjeto3DAtiva) {
            const motivoBloqueio = obtemBloqueioCarregamentoCenaCanonicaEditor3D(estado);

            if (motivoBloqueio !== null) {
                acoes.exibeNotificacaoAreaInterativa(motivoBloqueio);

                return;
            }
        }

        if (abaProjeto3DTemAlteracaoNaoSalvaEditor3D(aba) && !window.confirm(obtemMensagemFecharAbaProjeto3D(aba))) return;

        acoes.fechaAbaProjeto3D(aba.id);
    };

    return (
        <section className={styles.barraAbasProjetoEditor3D} data-editor3d-shell="true" aria-label="Projetos abertos no Editor 3D">
            <div className={styles.listaAbasProjetoEditor3D} role="tablist">
                {abas.map(aba => {
                    const ativa = aba.id === estado.idAbaProjeto3DAtiva;
                    const alterada = abaProjeto3DTemAlteracaoNaoSalvaEditor3D(aba);

                    return (
                        <div key={aba.id} className={`${styles.abaProjetoEditor3D} ${ativa ? styles.abaProjetoEditor3DAtiva : ''}`}>
                            <button type="button" role="tab" className={styles.botaoSelecionarAbaProjetoEditor3D} onClick={() => trocaAba(aba)} aria-selected={ativa}>
                                <span className={styles.nomeAbaProjetoEditor3D}>{aba.nome}</span>
                                {alterada && <span className={styles.indicadorAbaProjetoEditor3D} aria-label="Projeto com alteracoes nao salvas" />}
                            </button>
                            <button type="button" className={styles.botaoFecharAbaProjetoEditor3D} onClick={evento => fechaAba(evento, aba)} aria-label={`Fechar ${aba.nome}`}><Cross2Icon /></button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};