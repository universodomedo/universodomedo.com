import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ARQUIVOS_INTERNOS, AvatarPersonagemDto } from 'types-nora-api';

import { useContextoGerenciarAvatares__Personagem } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal';
import RecipienteAdicionarAvatarDePersonagem from 'Contextos/Contexto__PaginaArtista_AdicionarAvatarDePersonagem/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { formataData } from '@/uteis/FormatadorDeDatas/FormatadorDeDatas';

export default function ModalUploadEVerificacaoAvatar({ modalEstaAberta, onOpenChange, chaveAvatarConfigurando }: { modalEstaAberta: boolean; onOpenChange: (open: boolean) => void; chaveAvatarConfigurando: AvatarPersonagemDto; }) {
    const { personagem, avataresDeComparacao } = useContextoGerenciarAvatares__Personagem();

    const [transparenciasAvataresDeComparacao, setTransparenciasAvataresDeComparacao] = useState<number[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [zoomAtivo, setZoomAtivo] = useState(false);
    const [zoomTravado, setZoomTravado] = useState(false);
    const [fatorZoom, setFatorZoom] = useState(2.5);
    const [posicaoDoMouseNoAvatar, setPosicaoDoMouseNoAvatar] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [dimensoesRecipienteValidacaoAvatar, setDimensoesRecipienteValidacaoAvatar] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [dimensoesLenteZoom, setDimensoesLenteZoom] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const refRecipienteValidacaoAvatar = useRef<HTMLDivElement | null>(null);
    const refLenteZoomValidacaoAvatar = useRef<HTMLDivElement | null>(null);

    const ultimoAvatarDessePersonagem = personagem.avatarAtual;
    const avataresParaValidacao = useMemo(() => {
        const listaDeAvataresParaValidacao = [...avataresDeComparacao];
        if (ultimoAvatarDessePersonagem && !listaDeAvataresParaValidacao.includes(ultimoAvatarDessePersonagem)) listaDeAvataresParaValidacao.push(ultimoAvatarDessePersonagem);
        return listaDeAvataresParaValidacao;
    }, [avataresDeComparacao, ultimoAvatarDessePersonagem]);

    const fatorMinimoZoom = 1.5;
    const fatorMaximoZoom = 6;
    const passoZoom = 0.25;
    const larguraRecipienteValidacaoAvatar = dimensoesRecipienteValidacaoAvatar.width || 1;
    const alturaRecipienteValidacaoAvatar = dimensoesRecipienteValidacaoAvatar.height || 1;
    const larguraLenteZoom = dimensoesLenteZoom.width || 1;
    const alturaLenteZoom = dimensoesLenteZoom.height || 1;
    const deslocamentoHorizontalDoZoom = (larguraLenteZoom / 2) - (posicaoDoMouseNoAvatar.x * fatorZoom);
    const deslocamentoVerticalDoZoom = (alturaLenteZoom / 2) - (posicaoDoMouseNoAvatar.y * fatorZoom);

    useEffect(() => {
        setTransparenciasAvataresDeComparacao(avataresParaValidacao.map(() => 0));
    }, [avataresParaValidacao]);

    useEffect(() => {
        if (!modalEstaAberta) return;

        const idAnimacao = window.requestAnimationFrame(() => {
            atualizaDimensoesDoZoom();
        });

        window.addEventListener('resize', atualizaDimensoesDoZoom);

        return () => {
            window.cancelAnimationFrame(idAnimacao);
            window.removeEventListener('resize', atualizaDimensoesDoZoom);
        };
    }, [modalEstaAberta, avataresParaValidacao, previewUrl]);

    function atualizaDimensoesDoZoom() {
        if (refRecipienteValidacaoAvatar.current) {
            const recipienteValidacaoAvatar = refRecipienteValidacaoAvatar.current;
            setDimensoesRecipienteValidacaoAvatar({ width: recipienteValidacaoAvatar.offsetWidth, height: recipienteValidacaoAvatar.offsetHeight });
        }

        if (refLenteZoomValidacaoAvatar.current) {
            const lenteZoom = refLenteZoomValidacaoAvatar.current;
            setDimensoesLenteZoom({ width: lenteZoom.offsetWidth, height: lenteZoom.offsetHeight });
        }
    }

    function alteraTransparenciaAvatarDeComparacao(index: number, visibilidade: number) { setTransparenciasAvataresDeComparacao(valorAtual => valorAtual.map((valor, indice) => indice === index ? 100 - visibilidade : valor)); };

    function obtemPosicaoDoMouseNoAvatar(event: React.MouseEvent<HTMLDivElement>) {
        if (!refRecipienteValidacaoAvatar.current) return null;

        const recipienteValidacaoAvatar = refRecipienteValidacaoAvatar.current;
        const rectRecipienteValidacaoAvatar = recipienteValidacaoAvatar.getBoundingClientRect();
        const larguraLocalDoRecipiente = recipienteValidacaoAvatar.offsetWidth || 1;
        const alturaLocalDoRecipiente = recipienteValidacaoAvatar.offsetHeight || 1;
        const escalaHorizontalAplicada = rectRecipienteValidacaoAvatar.width / larguraLocalDoRecipiente;
        const escalaVerticalAplicada = rectRecipienteValidacaoAvatar.height / alturaLocalDoRecipiente;
        const x = (event.clientX - rectRecipienteValidacaoAvatar.left) / escalaHorizontalAplicada;
        const y = (event.clientY - rectRecipienteValidacaoAvatar.top) / escalaVerticalAplicada;

        return {
            x: Math.min(larguraLocalDoRecipiente, Math.max(0, x)),
            y: Math.min(alturaLocalDoRecipiente, Math.max(0, y)),
        };
    }

    function ativaZoom(event: React.MouseEvent<HTMLDivElement>) {
        atualizaDimensoesDoZoom();

        if (zoomTravado) {
            setZoomAtivo(true);
            return;
        }

        const novaPosicaoDoMouseNoAvatar = obtemPosicaoDoMouseNoAvatar(event);
        if (!novaPosicaoDoMouseNoAvatar) return;

        setPosicaoDoMouseNoAvatar(novaPosicaoDoMouseNoAvatar);
        setZoomAtivo(true);
    }

    function atualizaPosicaoDoZoom(event: React.MouseEvent<HTMLDivElement>) {
        if (zoomTravado) return;

        const novaPosicaoDoMouseNoAvatar = obtemPosicaoDoMouseNoAvatar(event);
        if (!novaPosicaoDoMouseNoAvatar) return;

        setPosicaoDoMouseNoAvatar(novaPosicaoDoMouseNoAvatar);
        setZoomAtivo(true);
    }

    function alternaTravamentoDoZoom(event: React.MouseEvent<HTMLDivElement>) {
        atualizaDimensoesDoZoom();

        const novaPosicaoDoMouseNoAvatar = obtemPosicaoDoMouseNoAvatar(event);
        if (!novaPosicaoDoMouseNoAvatar) return;

        setPosicaoDoMouseNoAvatar(novaPosicaoDoMouseNoAvatar);
        setZoomAtivo(true);
        setZoomTravado(valorAtual => !valorAtual);
    }

    function ajustaZoomPeloScroll(event: React.WheelEvent<HTMLDivElement>) {
        if (!zoomAtivo) return;

        event.preventDefault();

        setFatorZoom(valorAtual => {
            const proximoValor = event.deltaY < 0 ? valorAtual + passoZoom : valorAtual - passoZoom;
            return Math.min(fatorMaximoZoom, Math.max(fatorMinimoZoom, proximoValor));
        });
    }

    function desativaZoom() {
        if (zoomTravado) return;
        setZoomAtivo(false);
    }

    function renderizaConteudoValidacaoAvatar() {
        return (
            <>
                {previewUrl && <img className={styles.preview_validacao_avatar} src={previewUrl} alt="Pré-visualização do avatar" />}
                {avataresParaValidacao.map((avatarDeComparacao, index) => (
                    <div key={index} className={styles.recipiente_avatar_de_comparacao} style={{ opacity: 1 - ((transparenciasAvataresDeComparacao[index] ?? 0) / 100) }}>
                        <RecipienteImagem src={avatarDeComparacao} />
                    </div>
                ))}
                <RecipienteImagem src={ARQUIVOS_INTERNOS.GUIA_AVATAR.caminhoArquivo} />
            </>
        );
    }

    return (
        <Modal open={modalEstaAberta} onOpenChange={onOpenChange}>
            <Modal.Content cabecalho={{ titulo: `Configurando Avatar - ${personagem.nome}`, subtitulo: `${chaveAvatarConfigurando?.dataMomentoCanonico && formataData(chaveAvatarConfigurando?.dataMomentoCanonico)} | ${chaveAvatarConfigurando?.descricao}` }}>
                <div className={styles.recipiente_componente_de_validacao_uploader_avatar}>
                    <div className={styles.recipiente_uploader_avatar}>
                        <RecipienteAdicionarAvatarDePersonagem idChaveNovoAvatar={chaveAvatarConfigurando!.idChaveNovoAvatar} onPreviewUrlChange={setPreviewUrl} />
                    </div>
                    <div className={styles.recipiente_validador_avatar}>
                        <div className={styles.recipiente_visualizacao_validacao_avatar}>
                            <div ref={refRecipienteValidacaoAvatar} className={styles.recipiente_validacao_avatar} onMouseEnter={ativaZoom} onMouseMove={atualizaPosicaoDoZoom} onMouseLeave={desativaZoom} onWheel={ajustaZoomPeloScroll} onDoubleClick={alternaTravamentoDoZoom}>
                                {renderizaConteudoValidacaoAvatar()}
                                <div className={styles.recipiente_sombra_zoom_validacao_avatar} style={{ opacity: zoomAtivo ? 1 : 0 }} />
                                <div ref={refLenteZoomValidacaoAvatar} className={styles.recipiente_lente_zoom_validacao_avatar} style={{ left: `${posicaoDoMouseNoAvatar.x}px`, top: `${posicaoDoMouseNoAvatar.y}px`, opacity: zoomAtivo ? 1 : 0 }}>
                                    <div className={styles.recipiente_conteudo_lente_zoom_validacao_avatar} style={{ width: `${larguraRecipienteValidacaoAvatar}px`, height: `${alturaRecipienteValidacaoAvatar}px`, transform: `translate(${deslocamentoHorizontalDoZoom}px, ${deslocamentoVerticalDoZoom}px) scale(${fatorZoom})` }}>
                                        {renderizaConteudoValidacaoAvatar()}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.recipiente_controladores_transparencia_avatares}>
                                {avataresParaValidacao.map((avatarDeComparacao, index) => (
                                    <div key={index} className={styles.recipiente_controle_transparencia_avatar}>
                                        <div className={styles.recipiente_preview_controle_avatar}>
                                            <RecipienteImagem src={avatarDeComparacao} />
                                        </div>
                                        <input className={styles.input_controle_transparencia_avatar} type="range" min="0" max="100" step="1" value={100 - (transparenciasAvataresDeComparacao[index] ?? 0)} onChange={event => alteraTransparenciaAvatarDeComparacao(index, Number(event.target.value))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};