'use client';

import styles from './styles.module.css';

import { useMemo, useRef, useState } from 'react';
import type { RegrasUploadArquivo } from 'types-nora-api';

import { useContextoUploadImagem } from 'Contextos/ContextoUploadImagem/contexto';

function bytesParaTexto(bytes: number) {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MiB`;
    if (kb >= 1) return `${kb.toFixed(2)} KiB`;
    return `${bytes} B`;
}

function gerarRegrasTexto(regras: RegrasUploadArquivo) {
    const itens: string[] = [];
    itens.push(`Formatos permitidos: ${regras.formatosPermitidos.map((f) => f.toUpperCase()).join(', ')}`);

    if (regras.tamanho) {
        const partes: string[] = [];
        if (regras.tamanho.minBytes !== undefined) partes.push(`mínimo ${bytesParaTexto(regras.tamanho.minBytes)}`);
        if (regras.tamanho.maxBytes !== undefined) partes.push(`máximo ${bytesParaTexto(regras.tamanho.maxBytes)}`);
        itens.push(`Tamanho do arquivo: ${partes.join(' e ')}`);
    } else {
        itens.push('Tamanho do arquivo: qualquer');
    }

    if ('imagem' in regras && regras.imagem) {
        if (regras.imagem.tipoValidacao === 'dimensoes') {
            const d = regras.imagem.dimensoes;
            if (d.modo === 'exato') itens.push(`Dimensões: exatamente ${d.exato.largura}x${d.exato.altura}`);
            else {
                const partes: string[] = [];
                if (d.min) partes.push(`mínimo ${d.min.largura}x${d.min.altura}`);
                if (d.max) partes.push(`máximo ${d.max.largura}x${d.max.altura}`);
                itens.push(`Dimensões: ${partes.join(' e ')}`);
            }
        } else if (regras.imagem.tipoValidacao === 'proporcao') {
            const p = regras.imagem.proporcao;
            itens.push(`Proporção: ${p.largura}:${p.altura}${p.toleranciaPercentual !== undefined ? ` (±${p.toleranciaPercentual}%)` : ''}`);
        } else {
            itens.push('Validação de imagem: nenhuma');
        }

        if (regras.imagem.maxPixels !== undefined) itens.push(`Limite de pixels: ${regras.imagem.maxPixels.toLocaleString('pt-BR')}`);
    }

    return itens;
}

export default function Uploader() {
    const { regras, accept, previewUrl, erro, isValido, isCarregando, selecionarArquivo, limpar, enviar } = useContextoUploadImagem();
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const regrasTexto = useMemo(() => gerarRegrasTexto(regras), [regras]);

    function abrirSeletorArquivos() {
        if (isCarregando || !inputRef.current) return;
        inputRef.current.value = '';
        inputRef.current.click();
    }

    async function onChangeArquivo(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
        if (!arquivo) return;
        await selecionarArquivo(arquivo);
    }

    async function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (isCarregando) return;
        setIsDragOver(false);
        const arquivo = e.dataTransfer.files && e.dataTransfer.files.length > 0 ? e.dataTransfer.files[0] : null;
        if (!arquivo) return;
        await selecionarArquivo(arquivo);
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (isCarregando) return;
        if (!isDragOver) setIsDragOver(true);
    }

    function onDragLeave() {
        if (isCarregando) return;
        setIsDragOver(false);
    }

    function removerArquivo(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (isCarregando) return;
        limpar();
    }

    return (
        <div className={styles.uploader}>
            <div className={styles.regras}>
                {regrasTexto.map((t) => <h3 key={t}>{t}</h3>)}
            </div>

            <div className={`${styles.dropzone} ${isDragOver ? styles.dropzoneAtivo : ''} ${isCarregando ? styles.dropzoneBloqueado : ''} ${previewUrl ? styles.dropzoneComPreview : ''}`} onClick={abrirSeletorArquivos} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} role="button" tabIndex={0} aria-disabled={isCarregando}>
                <input ref={inputRef} className={styles.inputEscondido} type="file" accept={accept} onChange={onChangeArquivo} disabled={isCarregando} />

                {!previewUrl ? (
                    <div className={styles.estadoVazio}>
                        <div className={styles.vazioTitulo}>{isCarregando ? 'Processando...' : 'Arraste e solte aqui'}</div>
                        <div className={styles.vazioHint}>{isCarregando ? 'Aguarde um momento' : 'ou clique para selecionar'}</div>
                    </div>
                ) : (
                    <div className={styles.estadoPreview}>
                        <img className={styles.previewImagem} src={previewUrl} alt="Pré-visualização" />
                        <button className={styles.botaoRemover} type="button" onClick={removerArquivo} aria-label="Remover arquivo">×</button>
                    </div>
                )}
            </div>

            {erro ? <div className={styles.erro} aria-live="polite">{erro}</div> : null}

            <div className={styles.acoes}>
                <button className={styles.botaoPrimario} onClick={() => enviar()} disabled={!isValido || isCarregando}>{isCarregando ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </div>
    );
}