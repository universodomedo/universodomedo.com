'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { EventosApiRest } from 'types-nora-api/api/rest';

import { NoraApi } from 'Api/NoraApi';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { CenaCanonicaEditor3D, Projeto3DMinimoPersistido } from 'types-nora-api/shared';

interface StatusInspecaoCenaEditor3D {
    readonly texto: string;
    readonly bloqueado: boolean;
};

function formataCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): string { return JSON.stringify(cena, null, 4); };
function formataProjeto3DMinimoPersistido(projeto: Projeto3DMinimoPersistido): string { return JSON.stringify(projeto, null, 4); };

export function PainelInspecaoCenaEditor3D() {
    const { estado } = useEditor3DContexto();
    const [dadosCena, setDadosCena] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusInspecaoCenaEditor3D | null>(null);
    const [salvandoCasoSimples, setSalvandoCasoSimples] = useState(false);
    const bloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);

    function preparaCenaCanonicaParaAcao(nomeAcao: string): CenaCanonicaEditor3D | null {
        const motivoBloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatus({ texto: motivoBloqueio, bloqueado: true });
            setDadosCena(null);
            console.log(`${nomeAcao} bloqueada`, { motivo: motivoBloqueio });

            return null;
        }

        return serializaEditor3DParaCenaCanonica(estado);
    };

    function geraDadosCena(): void {
        const cena = preparaCenaCanonicaParaAcao('Geracao de dados da cena');

        if (cena === null) return;

        const dadosFormatados = formataCenaCanonicaEditor3D(cena);

        setStatus({ texto: `Dados gerados com ${cena.objetos.length} objeto(s) confirmado(s).`, bloqueado: false });
        setDadosCena(dadosFormatados);
        console.log('Dados canonicos da cena do Editor 3D', cena);
    };

    async function salvaCasoSimples(): Promise<void> {
        const cena = preparaCenaCanonicaParaAcao('Salvamento do caso simples da cena');

        if (cena === null) return;

        setSalvandoCasoSimples(true);
        setStatus({ texto: 'Salvando caso simples da cena...', bloqueado: false });
        setDadosCena(formataCenaCanonicaEditor3D(cena));

        try {
            const projeto = await NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvaCasoSimples, { nome: 'Teste Cubo Persistido', cenaCanonica: cena }, { mensagemErro: 'Falha ao salvar caso simples do projeto 3D' });

            setStatus({ texto: `Projeto salvo com id ${projeto.id}.`, bloqueado: false });
            setDadosCena(formataProjeto3DMinimoPersistido(projeto));
            console.log('Projeto 3D minimo persistido', projeto);
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao salvar caso simples do projeto 3D';

            setStatus({ texto: mensagemErro, bloqueado: true });
            console.log('Salvamento do caso simples do Editor 3D falhou', { erro: mensagemErro });
        } finally {
            setSalvandoCasoSimples(false);
        }
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
                <button className={`${styles.botaoControle} ${styles.botaoControleComIcone} ${bloqueio !== null ? styles.botaoControleBloqueado : ''}`} type="button" onClick={salvaCasoSimples} disabled={salvandoCasoSimples}>
                    <span className={styles.rotuloBotaoControleEditor3D}>
                        <span className={styles.iconeBotaoControleEditor3D}>{'->'}</span>
                        <span>{salvandoCasoSimples ? 'Salvando caso simples' : 'Salvar caso simples'}</span>
                    </span>
                    <strong>{estado.objetos.length}</strong>
                </button>

                {status !== null && <div className={`${styles.statusInspecaoCenaEditor3D} ${status.bloqueado ? styles.statusInspecaoCenaEditor3DBloqueado : ''}`}>{status.texto}</div>}
                {dadosCena !== null && <textarea className={styles.areaDadosCenaEditor3D} value={dadosCena} readOnly aria-label="Dados canonicos da cena" />}
            </div>
        </PainelColapsavelEditor3D>
    );
};