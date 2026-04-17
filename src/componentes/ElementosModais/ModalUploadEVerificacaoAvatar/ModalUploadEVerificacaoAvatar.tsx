import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { useContextoGerenciarAvatares__Personagem } from 'Contextos/ContextoGerenciarAvatares__Personagem/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal';
import RecipienteAdicionarAvatarDePersonagem from 'Contextos/Contexto__PaginaArtista_AdicionarAvatarDePersonagem/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function ModalUploadEVerificacaoAvatar({ modalEstaAberta, onOpenChange }: { modalEstaAberta: boolean; onOpenChange: (open: boolean) => void }) {
    const { personagem, avataresDeComparacao } = useContextoGerenciarAvatares__Personagem();

    const [transparenciasAvataresDeComparacao, setTransparenciasAvataresDeComparacao] = useState<number[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [zoomAtivo, setZoomAtivo] = useState(false);
    const [estadoZoom, setEstadoZoom] = useState<{ xPercentual: number; yPercentual: number }>({ xPercentual: 0.5, yPercentual: 0.5 });
    const [dimensoesRecipienteValidacaoAvatar, setDimensoesRecipienteValidacaoAvatar] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [dimensoesViewportZoom, setDimensoesViewportZoom] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const refRecipienteValidacaoAvatar = useRef<HTMLDivElement | null>(null);
    const refViewportZoomValidacaoAvatar = useRef<HTMLDivElement | null>(null);

    const ultimoAvatarDessePersonagem = personagem.avatares.caminhosAvatares.at(-1);
    const avataresParaValidacao = useMemo(() => {
        const listaDeAvataresParaValidacao = [...avataresDeComparacao];
        if (ultimoAvatarDessePersonagem && !listaDeAvataresParaValidacao.includes(ultimoAvatarDessePersonagem)) listaDeAvataresParaValidacao.push(ultimoAvatarDessePersonagem);
        return listaDeAvataresParaValidacao;
    }, [avataresDeComparacao, ultimoAvatarDessePersonagem]);

    const fatorZoom = 2.5;
    const larguraRecipienteValidacaoAvatar = dimensoesRecipienteValidacaoAvatar.width || 1;
    const alturaRecipienteValidacaoAvatar = dimensoesRecipienteValidacaoAvatar.height || 1;
    const larguraViewportZoom = dimensoesViewportZoom.width || 1;
    const alturaViewportZoom = dimensoesViewportZoom.height || 1;
    const deslocamentoHorizontalDoZoom = (larguraViewportZoom / 2) - (estadoZoom.xPercentual * larguraRecipienteValidacaoAvatar * fatorZoom);
    const deslocamentoVerticalDoZoom = (alturaViewportZoom / 2) - (estadoZoom.yPercentual * alturaRecipienteValidacaoAvatar * fatorZoom);

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
            const rectRecipienteValidacaoAvatar = refRecipienteValidacaoAvatar.current.getBoundingClientRect();
            setDimensoesRecipienteValidacaoAvatar({ width: rectRecipienteValidacaoAvatar.width, height: rectRecipienteValidacaoAvatar.height });
        }

        if (refViewportZoomValidacaoAvatar.current) {
            const rectViewportZoom = refViewportZoomValidacaoAvatar.current.getBoundingClientRect();
            setDimensoesViewportZoom({ width: rectViewportZoom.width, height: rectViewportZoom.height });
        }
    }

    function alteraTransparenciaAvatarDeComparacao(index: number, visibilidade: number) { setTransparenciasAvataresDeComparacao(valorAtual => valorAtual.map((valor, indice) => indice === index ? 100 - visibilidade : valor)); };

    function atualizaPosicaoDoZoom(event: React.MouseEvent<HTMLDivElement>) {
        if (!refRecipienteValidacaoAvatar.current) return;

        const rectRecipienteValidacaoAvatar = refRecipienteValidacaoAvatar.current.getBoundingClientRect();
        const xPercentual = Math.min(1, Math.max(0, (event.clientX - rectRecipienteValidacaoAvatar.left) / rectRecipienteValidacaoAvatar.width));
        const yPercentual = Math.min(1, Math.max(0, (event.clientY - rectRecipienteValidacaoAvatar.top) / rectRecipienteValidacaoAvatar.height));

        atualizaDimensoesDoZoom();
        setEstadoZoom({ xPercentual, yPercentual });
        setZoomAtivo(true);
    }

    function desativaZoom() { setZoomAtivo(false); };

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
            <Modal.Content cabecalho={{ titulo: `Incluindo Avatar - ${personagem.nome}` }}>
                <div className={styles.recipiente_componente_de_validacao_uploader_avatar}>
                    <div className={styles.recipiente_uploader_avatar}>
                        <RecipienteAdicionarAvatarDePersonagem idPersonagem={personagem.id} onPreviewUrlChange={setPreviewUrl} />
                    </div>
                    <div className={styles.recipiente_validador_avatar}>
                        <div className={styles.recipiente_visualizacao_validacao_avatar}>
                            <div ref={refRecipienteValidacaoAvatar} className={styles.recipiente_validacao_avatar} onMouseEnter={atualizaPosicaoDoZoom} onMouseMove={atualizaPosicaoDoZoom} onMouseLeave={desativaZoom}>
                                {renderizaConteudoValidacaoAvatar()}
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
                        <div className={styles.recipiente_area_visualizao_zoom}>
                            <div ref={refViewportZoomValidacaoAvatar} className={styles.recipiente_viewport_zoom_validacao_avatar}>
                                <div className={styles.recipiente_posicionamento_zoom_validacao_avatar} style={{ transform: `translate(${deslocamentoHorizontalDoZoom}px, ${deslocamentoVerticalDoZoom}px)`, opacity: zoomAtivo ? 1 : 0.85 }}>
                                    <div className={styles.recipiente_conteudo_zoom_validacao_avatar} style={{ width: `${larguraRecipienteValidacaoAvatar}px`, height: `${alturaRecipienteValidacaoAvatar}px`, transform: `scale(${fatorZoom})` }}>
                                        {renderizaConteudoValidacaoAvatar()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};