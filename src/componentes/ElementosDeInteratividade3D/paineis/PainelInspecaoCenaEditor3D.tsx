'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { EventosApiRest } from 'types-nora-api/api/rest';

import { NoraApi } from 'Api/NoraApi';
import { PainelColapsavelEditor3D } from './PainelColapsavelEditor3D';
import { obtemBloqueioGeracaoCenaCanonicaEditor3D, serializaEditor3DParaCenaCanonica } from '../editor/editor3D.cenaCanonica.serializador';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { CenaCanonicaEditor3D, Projeto3DMinimoPersistido } from 'types-nora-api/shared';

interface StatusInspecaoCenaEditor3D {
    readonly texto: string;
    readonly bloqueado: boolean;
};

function formataCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): string { return JSON.stringify(cena, null, 4); };
function formataProjeto3DMinimoPersistido(projeto: Projeto3DMinimoPersistido): string { return JSON.stringify(projeto, null, 4); };

function obtemBloqueioCarregamentoProjetoMinimoEditor3D(state: Editor3DState): string | null {
    if (state.malhaEmCriacao !== null) return 'Finalize ou cancele a malha em criacao antes de carregar o projeto minimo.';
    if (state.modoAtual.tipo !== 'NENHUM') return 'Confirme ou cancele a transformacao em andamento antes de carregar o projeto minimo.';
    if (state.insetFaceEdicao !== null) return 'Confirme ou cancele o inset em edicao antes de carregar o projeto minimo.';
    if (state.bevelEdicao !== null) return 'Confirme ou cancele o bevel em edicao antes de carregar o projeto minimo.';
    if (state.modoOperacao !== 'OBJETO') return 'Saia do modo de edicao antes de carregar o projeto minimo.';

    return null;
};

function normalizaIdProjetoMinimoTecnico(valor: string): number | null {
    const idProjeto = Number(valor.trim());

    return Number.isInteger(idProjeto) && idProjeto > 0 ? idProjeto : null;
};

export function PainelInspecaoCenaEditor3D() {
    const { estado, acoes } = useEditor3DContexto();
    const [dadosCena, setDadosCena] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusInspecaoCenaEditor3D | null>(null);
    const [salvandoCasoSimples, setSalvandoCasoSimples] = useState(false);
    const [carregandoProjetoMinimo, setCarregandoProjetoMinimo] = useState(false);
    const [idProjetoCarga, setIdProjetoCarga] = useState('');
    const bloqueio = obtemBloqueioGeracaoCenaCanonicaEditor3D(estado);
    const bloqueioCarga = obtemBloqueioCarregamentoProjetoMinimoEditor3D(estado);

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
            setIdProjetoCarga(String(projeto.id));
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

    async function carregaProjetoMinimo(): Promise<void> {
        const idProjeto = normalizaIdProjetoMinimoTecnico(idProjetoCarga);

        if (idProjeto === null) {
            setStatus({ texto: 'Informe um ID tecnico de projeto valido para carregar.', bloqueado: true });
            setDadosCena(null);

            return;
        }

        const motivoBloqueio = obtemBloqueioCarregamentoProjetoMinimoEditor3D(estado);

        if (motivoBloqueio !== null) {
            setStatus({ texto: motivoBloqueio, bloqueado: true });
            setDadosCena(null);
            console.log('Carregamento do projeto minimo bloqueado', { motivo: motivoBloqueio });

            return;
        }

        setCarregandoProjetoMinimo(true);
        setStatus({ texto: `Carregando projeto minimo ${idProjeto}...`, bloqueado: false });
        setDadosCena(null);

        try {
            const projeto = await NoraApi.RestGET(EventosApiRest.GET.Projeto3DTecnico.consultaRegistro, { idProjeto }, { mensagemErro: 'Falha ao carregar projeto minimo 3D' });

            if (projeto === null) {
                setStatus({ texto: `Projeto minimo ${idProjeto} nao encontrado.`, bloqueado: true });
                console.log('Projeto 3D minimo nao encontrado', { idProjeto });

                return;
            }

            acoes.carregaCenaCanonica(projeto.cenaCanonica);
            setStatus({ texto: `Projeto ${projeto.id} carregado com ${projeto.cenaCanonica.objetos.length} objeto(s).`, bloqueado: false });
            setDadosCena(formataProjeto3DMinimoPersistido(projeto));
            console.log('Projeto 3D minimo carregado', projeto);
        } catch (erroCapturado) {
            const mensagemErro = erroCapturado instanceof Error ? erroCapturado.message : 'Erro desconhecido ao carregar projeto minimo 3D';

            setStatus({ texto: mensagemErro, bloqueado: true });
            console.log('Carregamento do projeto minimo do Editor 3D falhou', { erro: mensagemErro });
        } finally {
            setCarregandoProjetoMinimo(false);
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
                <div className={styles.linhaTecnicaInspecaoCenaEditor3D}>
                    <label className={styles.rotuloCampoTecnicoInspecaoCenaEditor3D} htmlFor="id-projeto-minimo-editor-3d">ID tecnico</label>
                    <input className={styles.campoTecnicoInspecaoCenaEditor3D} id="id-projeto-minimo-editor-3d" type="text" inputMode="numeric" value={idProjetoCarga} onChange={evento => setIdProjetoCarga(evento.currentTarget.value)} placeholder="ID do projeto" />
                </div>
                <button className={`${styles.botaoControle} ${styles.botaoControleComIcone} ${bloqueioCarga !== null ? styles.botaoControleBloqueado : ''}`} type="button" onClick={carregaProjetoMinimo} disabled={carregandoProjetoMinimo}>
                    <span className={styles.rotuloBotaoControleEditor3D}>
                        <span className={styles.iconeBotaoControleEditor3D}>{'<-'}</span>
                        <span>{carregandoProjetoMinimo ? 'Carregando projeto minimo' : 'Carregar projeto minimo'}</span>
                    </span>
                    <strong>{idProjetoCarga.trim() || '-'}</strong>
                </button>

                {status !== null && <div className={`${styles.statusInspecaoCenaEditor3D} ${status.bloqueado ? styles.statusInspecaoCenaEditor3DBloqueado : ''}`}>{status.texto}</div>}
                {dadosCena !== null && <textarea className={styles.areaDadosCenaEditor3D} value={dadosCena} readOnly aria-label="Dados canonicos da cena" />}
            </div>
        </PainelColapsavelEditor3D>
    );
};