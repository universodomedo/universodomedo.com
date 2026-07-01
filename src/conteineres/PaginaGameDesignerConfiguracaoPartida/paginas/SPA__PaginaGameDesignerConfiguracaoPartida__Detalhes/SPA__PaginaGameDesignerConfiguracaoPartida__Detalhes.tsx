'use client';

import styles from './styles.module.css';

import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';

import { NoraApi } from 'Api/NoraApi';
import { obtemImagemCapaArte3D } from 'Funcionalidades/ArteDeCapa/arteDeCapa.api';
import { Renderiza__ImagemUDM__ArteCapaEnquadrada } from 'Uteis/RenderImagemUDM/Renderiza__ImagemUDM__ArteCapaEnquadrada';
import { ItemPartidaOrbital } from 'Componentes/ElementosDeJogo/ItemPartidaOrbital/ItemPartidaOrbital';
import { Componente_Selecionador__ArteCapa } from 'Componentes/Selecionadores/Componente_Selecionador__ArteCapa/Componente_Selecionador__ArteCapa';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Detalhes/contexto';
import { EventosApiRest, type ArteCapaDaPartida, type EncaixeArteCapaPartida } from 'types-nora-api';

const ENCAIXE_PADRAO: EncaixeArteCapaPartida = { escala: 1, deslocamentoX: 0, deslocamentoY: 0 };
// Proporção do item normal do Orbital (= RAZAO_LARGURA_MISSAO / RAZAO_ALTURA_MISSAO no CatalogoDeMissoes) e fração vertical visível da capa 16:9 nele a escala 1.
const ASPECT_ITEM_NORMAL = 3.6;
const FRACAO_VERTICAL = (16 / 9) / ASPECT_ITEM_NORMAL;

function limita(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };

type Arraste = { ponteiroX: number; ponteiroY: number; deslocamentoX: number; deslocamentoY: number; largura: number; altura: number; fracaoLargura: number; fracaoAltura: number };

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Detalhes() {
    const { partida } = useContexto__PaginaGameDesignerConfiguracaoPartida__Detalhes();
    const [idProjeto, setIdProjeto] = useState<number | null>(partida.arteCapa?.idProjeto ?? null);
    const [encaixe, setEncaixe] = useState<EncaixeArteCapaPartida>(partida.arteCapa?.encaixe ?? ENCAIXE_PADRAO);
    const [imagemBase64, setImagemBase64] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [selecionando, setSelecionando] = useState(false);
    const arrasteRef = useRef<Arraste | null>(null);

    // Carrega a imagem (base64) da capa selecionada.
    useEffect(() => {
        if (idProjeto === null) { setImagemBase64(null); return; }
        let ativo = true;
        obtemImagemCapaArte3D(idProjeto).then(imagem => { if (ativo) setImagemBase64(imagem?.imagemBase64 ?? null); }).catch(() => { });
        return () => { ativo = false; };
    }, [idProjeto]);

    function selecionaCapa(novoIdProjeto: number): void {
        setIdProjeto(novoIdProjeto);
        setEncaixe(ENCAIXE_PADRAO);
        setSelecionando(false);
    };

    // Recorte (o que o item normal do Orbital mostra) projetado sobre a imagem inteira: largura/altura encolhem com o zoom; posição = deslocamento.
    const fracaoLargura = Math.min(1, 1 / encaixe.escala);
    const fracaoAltura = FRACAO_VERTICAL / encaixe.escala;
    const centroX = 0.5 + encaixe.deslocamentoX * (1 - fracaoLargura) / 2;
    const centroY = 0.5 + encaixe.deslocamentoY * (1 - fracaoAltura) / 2;
    const estiloRecorte: CSSProperties = {
        left: `${(centroX - fracaoLargura / 2) * 100}%`,
        width: `${fracaoLargura * 100}%`,
        top: `${(centroY - fracaoAltura / 2) * 100}%`,
        height: `${fracaoAltura * 100}%`,
    };

    function aoBaixarPonteiro(evento: ReactPointerEvent<HTMLDivElement>): void {
        if (imagemBase64 === null) return;
        const retangulo = evento.currentTarget.getBoundingClientRect();
        arrasteRef.current = { ponteiroX: evento.clientX, ponteiroY: evento.clientY, deslocamentoX: encaixe.deslocamentoX, deslocamentoY: encaixe.deslocamentoY, largura: retangulo.width, altura: retangulo.height, fracaoLargura, fracaoAltura };
        evento.currentTarget.setPointerCapture(evento.pointerId);
    };

    function aoMoverPonteiro(evento: ReactPointerEvent<HTMLDivElement>): void {
        const inicio = arrasteRef.current;
        if (!inicio) return;
        // Pan em X só tem folga quando há zoom (fracaoLargura < 1); senão a capa preenche a largura e X é no-op.
        const deslocamentoX = inicio.fracaoLargura >= 1 ? inicio.deslocamentoX : limita(inicio.deslocamentoX + (((evento.clientX - inicio.ponteiroX) / inicio.largura) * 2) / (1 - inicio.fracaoLargura), -1, 1);
        const deslocamentoY = inicio.fracaoAltura >= 1 ? inicio.deslocamentoY : limita(inicio.deslocamentoY + (((evento.clientY - inicio.ponteiroY) / inicio.altura) * 2) / (1 - inicio.fracaoAltura), -1, 1);
        setEncaixe(atual => ({ ...atual, deslocamentoX, deslocamentoY }));
    };

    function aoSoltarPonteiro(evento: ReactPointerEvent<HTMLDivElement>): void {
        arrasteRef.current = null;
        evento.currentTarget.releasePointerCapture(evento.pointerId);
    };

    async function salvar(): Promise<void> {
        setSalvando(true);
        const arteCapa: ArteCapaDaPartida | null = idProjeto === null ? null : { idProjeto, encaixe };
        try {
            await NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarArteCapa, { id: partida.id, arteCapa }, { mensagemErro: 'Não foi possível salvar a Arte de Capa da Partida.' });
        } finally { setSalvando(false); }
    };

    if (selecionando) return <Componente_Selecionador__ArteCapa idInicial={idProjeto} aoConfirmar={selecionaCapa} aoCancelar={() => setSelecionando(false)} />;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <section className={styles.detalhes}>
                    <fieldset className={styles.secao}>
                        {idProjeto === null ? (
                            <button type="button" className={styles.placeholder_vazio} onClick={() => setSelecionando(true)}>
                                <svg viewBox="0 0 24 24" className={styles.placeholder_icone} aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                                Escolher Arte de Capa
                            </button>
                        ) : (
                            <div className={styles.colunas}>
                                <div className={styles.coluna}>
                                    <div className={styles.editor_capa}>
                                        <input type="range" className={styles.zoom_vertical} min={1} max={4} step={0.05} value={encaixe.escala} onChange={evento => setEncaixe(atual => ({ ...atual, escala: Number(evento.target.value) }))} title={`Zoom (${encaixe.escala.toFixed(2)}×)`} aria-label="Zoom" />
                                        <div className={styles.imagem_aberta} onPointerDown={aoBaixarPonteiro} onPointerMove={aoMoverPonteiro} onPointerUp={aoSoltarPonteiro} onPointerCancel={aoSoltarPonteiro}>
                                            {imagemBase64 ? (
                                                <>
                                                    <Renderiza__ImagemUDM__ArteCapaEnquadrada imagemBase64={imagemBase64} />
                                                    <div className={styles.recorte} style={estiloRecorte} />
                                                </>
                                            ) : <span className={styles.vazio}>Carregando imagem…</span>}
                                            <button type="button" className={styles.botao_trocar} onPointerDown={evento => evento.stopPropagation()} onClick={() => setSelecionando(true)} title="Trocar Arte de Capa" aria-label="Trocar Arte de Capa">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.coluna}>
                                    <div className={styles.previa}>
                                        <div className={styles.previa_grupo}>
                                            <span className={styles.previa_label}>No catálogo</span>
                                            <ItemPartidaOrbital className={styles.previa_item_normal} nome={partida.nome} imagemBase64={imagemBase64} encaixe={encaixe} />
                                        </div>
                                        <div className={styles.previa_grupo}>
                                            <span className={styles.previa_label}>Selecionada (em foco)</span>
                                            <ItemPartidaOrbital className={styles.previa_item_selecionado} nome={partida.nome} imagemBase64={imagemBase64} encaixe={encaixe} selecionado />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </fieldset>
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void salvar()} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar Arte de Capa'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
