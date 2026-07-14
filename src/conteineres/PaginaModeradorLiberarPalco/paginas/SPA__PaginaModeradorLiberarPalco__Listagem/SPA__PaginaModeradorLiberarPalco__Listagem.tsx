'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { TAMANHO_MAXIMO_NOME_PALCO, type PalcoResumoDto } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaModeradorLiberarPalco__Listagem } from 'Contextos/Contexto__PaginaModeradorLiberarPalco__Listagem/contexto';

export default function SPA__PaginaModeradorLiberarPalco__Listagem() {
    const { palcos, processando, erro, criarPalco, abrirPalco, finalizarPalco } = useContexto__PaginaModeradorLiberarPalco__Listagem();
    const [nome, setNome] = useState('');

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.recipiente}>
                    {erro && <p className={styles.erro}>{erro}</p>}
                    <InputComRotulo rotulo="Nome do palco">
                        <input type="text" value={nome} maxLength={TAMANHO_MAXIMO_NOME_PALCO} placeholder="Ex.: Evento de Early Access" onChange={e => { setNome(e.target.value); }} />
                    </InputComRotulo>
                    {palcos.length === 0
                        ? <p className={styles.vazio}>Nenhum palco ativo no momento.</p>
                        : <div className={styles.palcos}>{palcos.map(palco => <CartaoPalco key={palco.codigoPalco} palco={palco} processando={processando} aoAbrir={abrirPalco} aoFinalizar={finalizarPalco} />)}</div>
                    }
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => { criarPalco(nome); }} disabled={processando || !nome.trim()}>{processando ? 'Aguarde...' : 'Criar Palco'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

function CartaoPalco({ palco, processando, aoAbrir, aoFinalizar }: { palco: PalcoResumoDto; processando: boolean; aoAbrir: (codigo: string) => void; aoFinalizar: (codigo: string) => void; }) {
    const abertura = new Date(palco.criadoEmTs);
    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className={styles.cartao}>
            <DivClicavel className={styles.cartao_corpo} onClick={() => aoAbrir(palco.codigoPalco)}>
                <strong className={styles.nome}>{palco.nome || `Palco de ${palco.nomeDono}`}</strong>
                <span className={styles.detalhe}>{`${palco.nomeDono} · aberto às ${pad(abertura.getHours())}:${pad(abertura.getMinutes())} · ${palco.totalParticipantes} presente${palco.totalParticipantes === 1 ? '' : 's'}`}</span>
                <span className={styles.codigo}>{palco.codigoPalco}</span>
            </DivClicavel>
            <button type="button" className={styles.finalizar} onClick={() => aoFinalizar(palco.codigoPalco)} disabled={processando}>Finalizar</button>
        </div>
    );
};