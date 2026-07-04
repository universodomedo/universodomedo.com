'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';

const OPCOES_TIPO: readonly OpcaoSelecionador[] = [
    { value: 'interno', label: 'Interno (menu de área reutilizável)' },
    { value: 'principal', label: 'Principal (barra global)' },
];

type Props = {
    chave: string;
    aoMudarChave: (valor: string) => void;
    tipo: 'principal' | 'interno';
    aoMudarTipo: (valor: 'principal' | 'interno') => void;
    descricao: string;
    aoMudarDescricao: (valor: string) => void;
    salvando: boolean;
    criar: () => Promise<void>;
    cancelar: () => void;
};

export default function SPA__PaginaAdminGestaoMenu__NovoMenu({ chave, aoMudarChave, tipo, aoMudarTipo, descricao, aoMudarDescricao, salvando, criar, cancelar }: Props) {
    const podeCriar = chave.trim().length > 0 && !salvando;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Chave *">
                        <input type="text" value={chave} onChange={e => aoMudarChave(e.target.value)} placeholder="ex.: INTERNO:minhasPaginas.novaArea" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tipo">
                        <SelecionadorOpcoes opcoes={OPCOES_TIPO} valor={tipo} onChange={valor => aoMudarTipo(valor === 'principal' ? 'principal' : 'interno')} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição (opcional)">
                        <input type="text" value={descricao} onChange={e => aoMudarDescricao(e.target.value)} />
                    </InputComRotulo>
                    <p className={styles.dica}>A chave é o identificador estrutural, imutável após criar. Menus internos são referenciados pelo mapa de layout das páginas.</p>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={criar} disabled={!podeCriar}>{salvando ? 'Criando...' : 'Criar menu'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
