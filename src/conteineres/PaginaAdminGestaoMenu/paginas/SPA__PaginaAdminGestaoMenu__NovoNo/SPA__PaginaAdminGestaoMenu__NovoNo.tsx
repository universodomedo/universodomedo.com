'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import type { RegistroPaginaNavegacao } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';

type Props = {
    tipo: 'item' | 'grupo';
    titulo: string;
    aoMudarTitulo: (valor: string) => void;
    paginaTemplate: string;
    aoMudarPaginaTemplate: (valor: string) => void;
    paginas: readonly RegistroPaginaNavegacao[];
    salvando: boolean;
    criar: () => Promise<void>;
    cancelar: () => void;
};

export default function SPA__PaginaAdminGestaoMenu__NovoNo({ tipo, titulo, aoMudarTitulo, paginaTemplate, aoMudarPaginaTemplate, paginas, salvando, criar, cancelar }: Props) {
    const opcoesPaginas: OpcaoSelecionador[] = [...paginas].sort((a, b) => a.label.localeCompare(b.label)).map(p => ({ value: p.template, label: `${p.label} — ${p.template}` }));
    const podeCriar = titulo.trim().length > 0 && (tipo === 'grupo' || paginaTemplate.length > 0) && !salvando;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Título *">
                        <input type="text" value={titulo} onChange={e => aoMudarTitulo(e.target.value)} />
                    </InputComRotulo>
                    {tipo === 'item' && (
                        <InputComRotulo rotulo="Página de destino *">
                            <SelecionadorOpcoes opcoes={opcoesPaginas} valor={paginaTemplate.length > 0 ? paginaTemplate : null} onChange={valor => aoMudarPaginaTemplate(valor ?? '')} placeholder="— selecione —" />
                        </InputComRotulo>
                    )}
                    {tipo === 'grupo' && <p className={styles.dica}>Um grupo apenas agrupa itens; não tem página de destino.</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={criar} disabled={!podeCriar}>{salvando ? 'Adicionando...' : `Adicionar ${tipo === 'grupo' ? 'grupo' : 'item'}`}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
