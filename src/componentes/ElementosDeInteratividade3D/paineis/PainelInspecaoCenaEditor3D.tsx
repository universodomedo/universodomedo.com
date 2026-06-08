'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { CenaCanonicaEditor3D } from '../editor/editor3D.cenaCanonica.tipos';

interface StatusInspecaoCenaEditor3D {
    readonly texto: string;
    readonly bloqueado: boolean;
};

function formataCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): string { return JSON.stringify(cena, null, 4); };

export function PainelInspecaoCenaEditor3D() {
    const { estado } = useEditor3DContexto();
    const [dadosCena, setDadosCena] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusInspecaoCenaEditor3D | null>(null);
    const bloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);

    function geraDadosCena(): void {
        const motivoBloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatus({ texto: motivoBloqueio, bloqueado: true });
            setDadosCena(null);
            console.log('Geracao de dados da cena bloqueada', { motivo: motivoBloqueio });

            return;
        }

        const cena = serializaEditor3DParaCenaCanonica(estado);
        const dadosFormatados = formataCenaCanonicaEditor3D(cena);

        setStatus({ texto: `Dados gerados com ${cena.objetos.length} objeto(s) confirmado(s).`, bloqueado: false });
        setDadosCena(dadosFormatados);
        console.log('Dados canonicos da cena do Editor 3D', cena);
    };

    return (
        <PainelColapsavelEditor3D titulo="Inspecao Tecnica" valor={String(estado.objetos.length)} abertoInicialmente={false}>
            <div className={styles.painelInspecaoCenaEditor3D}>
                <button className={`${styles.botaoControle} ${styles.botaoControleComIcone} ${bloqueio !== null ? styles.botaoControleBloqueado : ''}`} type="button" onClick={geraDadosCena}>
                    <span className={styles.rotuloBotaoControleEditor3D}>
                        <span className={styles.iconeBotaoControleEditor3D}>{'{}'}</span>
                        <span>Gerar dados da cena</span>
                    </span>
                    <strong>{estado.objetos.length}</strong>
                </button>

                {status !== null && <div className={`${styles.statusInspecaoCenaEditor3D} ${status.bloqueado ? styles.statusInspecaoCenaEditor3DBloqueado : ''}`}>{status.texto}</div>}
                {dadosCena !== null && <textarea className={styles.areaDadosCenaEditor3D} value={dadosCena} readOnly aria-label="Dados canonicos da cena" />}
            </div>
        </PainelColapsavelEditor3D>
    );
};