'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { acceptFromFormatos, FormatoUploadArquivo, isFormatoImagemBitmap, mimeFromFormato, RegrasUploadArquivo, validarRegrasUploadArquivo } from 'types-nora-api';

type ContextoUploadImagemProps = {
    regras: RegrasUploadArquivo;
    accept: string;
    arquivo: File | null;
    previewUrl: string | null;
    erro: string | null;
    isValido: boolean;
    isCarregando: boolean;
    selecionarArquivo: (arquivo: File) => Promise<void>;
    limpar: () => void;
    enviar: () => Promise<void>;
};

type PropsProvider = {
    regras: RegrasUploadArquivo;
    onEnviar?: (arquivo: File, regras: RegrasUploadArquivo) => Promise<void>;
    children: ReactNode;
};

function formatoFromFile(file: File): FormatoUploadArquivo | null {
    if (file.type === 'image/png') return 'png';
    if (file.type === 'image/jpeg') return 'jpg';
    if (file.type === 'image/svg+xml') return 'svg';
    return null;
}

async function lerDimensoesImagemBitmap(arquivo: File) {
    const url = URL.createObjectURL(arquivo);
    try {
        return await new Promise<{ largura: number; altura: number }>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ largura: img.width, altura: img.height });
            img.onerror = () => reject(new Error('Falha ao ler a imagem.'));
            img.src = url;
        });
    } finally {
        URL.revokeObjectURL(url);
    }
}

function proporcaoValida(largura: number, altura: number, regra: { largura: number; altura: number; toleranciaPercentual?: number }) {
    const proporcaoEsperada = regra.largura / regra.altura;
    const proporcaoAtual = largura / altura;
    const tolerancia = (regra.toleranciaPercentual ?? 0) / 100;
    if (tolerancia <= 0) return proporcaoAtual === proporcaoEsperada;
    const diffRelativo = Math.abs(proporcaoAtual - proporcaoEsperada) / proporcaoEsperada;
    return diffRelativo <= tolerancia;
}

const ContextoUploadImagem = createContext<ContextoUploadImagemProps | undefined>(undefined);

export const useContextoUploadImagem = (): ContextoUploadImagemProps => {
    const context = useContext(ContextoUploadImagem);
    if (!context) throw new Error('useContextoUploadImagem precisa estar dentro de um ContextoUploadImagem');
    return context;
};

export const ContextoUploadImagemProvider = ({ regras, onEnviar, children }: PropsProvider) => {
    const validacaoRegras = useMemo(() => validarRegrasUploadArquivo(regras), [regras]);
    if (!validacaoRegras.ok) throw new Error(`RegrasUploadArquivo inválidas: ${validacaoRegras.erros.join(' | ')}`);

    const accept = useMemo(() => acceptFromFormatos(regras.formatosPermitidos), [regras.formatosPermitidos]);

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [isValido, setIsValido] = useState<boolean>(false);
    const [isCarregando, setIsCarregando] = useState<boolean>(false);

    const previewUrlRef = useRef<string | null>(null);

    const limpar = useCallback(() => {
        setArquivo(null);
        setErro(null);
        setIsValido(false);
        setIsCarregando(false);
        setPreviewUrl(null);
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, []);

    const validarArquivo = useCallback(async (novoArquivo: File) => {
        const formato = formatoFromFile(novoArquivo);
        if (!formato) return 'Tipo de arquivo inválido (MIME não reconhecido).';
        if (!regras.formatosPermitidos.includes(formato)) return `Arquivo inválido. Permitidos: ${regras.formatosPermitidos.join(', ')}.`;

        if (regras.tamanho) {
            if (regras.tamanho.minBytes !== undefined && novoArquivo.size < regras.tamanho.minBytes) return `Arquivo pequeno demais. Mínimo: ${regras.tamanho.minBytes} bytes.`;
            if (regras.tamanho.maxBytes !== undefined && novoArquivo.size > regras.tamanho.maxBytes) return `Arquivo grande demais. Máximo: ${regras.tamanho.maxBytes} bytes.`;
        }

        if (!('imagem' in regras) || !regras.imagem) return null;
        if (!isFormatoImagemBitmap(formato)) return null;

        const dimensoes = await lerDimensoesImagemBitmap(novoArquivo);
        const pixels = dimensoes.largura * dimensoes.altura;

        if (regras.imagem.maxPixels !== undefined && pixels > regras.imagem.maxPixels) return `Imagem excede o limite de pixels. Máximo: ${regras.imagem.maxPixels}. Atual: ${pixels}.`;

        if (regras.imagem.tipoValidacao === 'dimensoes') {
            const d = regras.imagem.dimensoes;
            if (d.modo === 'exato') {
                if (dimensoes.largura !== d.exato.largura || dimensoes.altura !== d.exato.altura) return `Dimensão inválida: precisa ser exatamente ${d.exato.largura}x${d.exato.altura} (atual: ${dimensoes.largura}x${dimensoes.altura}).`;
                return null;
            }

            if (d.min) {
                if (dimensoes.largura < d.min.largura || dimensoes.altura < d.min.altura) return `Dimensão mínima não atingida: mínimo ${d.min.largura}x${d.min.altura} (atual: ${dimensoes.largura}x${dimensoes.altura}).`;
            }
            if (d.max) {
                if (dimensoes.largura > d.max.largura || dimensoes.altura > d.max.altura) return `Dimensão máxima excedida: máximo ${d.max.largura}x${d.max.altura} (atual: ${dimensoes.largura}x${dimensoes.altura}).`;
            }
            return null;
        }

        if (regras.imagem.tipoValidacao === 'proporcao') {
            const ok = proporcaoValida(dimensoes.largura, dimensoes.altura, regras.imagem.proporcao);
            if (!ok) return `Proporção inválida: precisa ser ${regras.imagem.proporcao.largura}:${regras.imagem.proporcao.altura}.`;
            return null;
        }

        return null;
    }, [regras]);

    const selecionarArquivo = useCallback(async (novoArquivo: File) => {
        setIsCarregando(true);
        setErro(null);
        setIsValido(false);

        const erroValidacao = await validarArquivo(novoArquivo);
        if (erroValidacao) {
            limpar();
            setErro(erroValidacao);
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        const url = URL.createObjectURL(novoArquivo);
        previewUrlRef.current = url;

        setArquivo(novoArquivo);
        setPreviewUrl(url);
        setIsValido(true);
        setIsCarregando(false);
    }, [validarArquivo, limpar]);

    const enviar = useCallback(async () => {
        if (!arquivo || !isValido || isCarregando) return;
        setIsCarregando(true);

        if (onEnviar) await onEnviar(arquivo, regras);
        else console.log('Upload (placeholder):', { nome: arquivo.name, tipo: arquivo.type, tamanhoBytes: arquivo.size, accept, formatos: regras.formatosPermitidos.map((f) => ({ formato: f, mime: mimeFromFormato(f) })) });

        setIsCarregando(false);
    }, [arquivo, isValido, isCarregando, onEnviar, regras, accept]);

    const value = useMemo<ContextoUploadImagemProps>(() => {
        return { regras, accept, arquivo, previewUrl, erro, isValido, isCarregando, selecionarArquivo, limpar, enviar };
    }, [regras, accept, arquivo, previewUrl, erro, isValido, isCarregando, selecionarArquivo, limpar, enviar]);

    return (
        <ContextoUploadImagem.Provider value={value}>
            {children}
        </ContextoUploadImagem.Provider>
    );
};