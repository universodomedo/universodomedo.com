'use client';

import { ComponentType, createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { acceptFromFormatos, FormatoUploadArquivo, isFormatoImagemBitmap, RegrasUploadArquivo, TipoArquivoDef, TIPOS_ARQUIVO, validarRegrasUploadArquivo } from 'types-nora-api';

import { buscaRegrasPorTipoArquivo, me_upload } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

import Uploader from 'Componentes/Elementos/Inputs/Uploader/Uploader';
import UploaderRecursosInternos from 'Componentes/Elementos/Inputs/Uploader/componentes/UploaderRecursosInternos/UploaderRecursosInternos';
import UploaderAvatar from '@/componentes/Elementos/Inputs/Uploader/componentes/UploaderAvatar/UploaderAvatar';
import UploaderArtes from 'Componentes/Elementos/Inputs/Uploader/componentes/UploaderArtes/UploaderArtes';
import UploaderEmblema from '@/componentes/Elementos/Inputs/Uploader/componentes/UploaderEmblema/UploaderEmblema';

type RecursosInternosState = { nome: string; setNome: (valor: string) => void; erro: string | null; };

type UploaderComponent = ComponentType;

type TipoArquivoId = (typeof TIPOS_ARQUIVO)[keyof typeof TIPOS_ARQUIVO]['id'];

type CamposExtrasUpload = Record<string, string | number>;

const UPLOADER_DEFAULT: UploaderComponent = Uploader;

const UPLOADER_POR_TIPO: Partial<Record<TipoArquivoId, UploaderComponent>> = {
    [TIPOS_ARQUIVO.RECURSOS_INTERNOS.id]: UploaderRecursosInternos,
    [TIPOS_ARQUIVO.AVATAR_PERSONAGEM.id]: UploaderAvatar,
    [TIPOS_ARQUIVO.IMAGEM_ESPECIAL_ARTISTA.id]: UploaderArtes,
    [TIPOS_ARQUIVO.ITENS_EMBLEMAS.id]: UploaderEmblema,
    // outros tipos específicos aqui...
};

export function resolveUploaderPorTipo(tipoArquivo: TipoArquivoDef): UploaderComponent { return UPLOADER_POR_TIPO[tipoArquivo.id as TipoArquivoId] ?? UPLOADER_DEFAULT; };

type ContextoUploadImagemProps = {
    regras: RegrasUploadArquivo;
    accept: string;
    tipoArquivo: TipoArquivoDef;
    arquivo: File | null;
    previewUrl: string | null;
    erro: string | null;
    isValido: boolean;
    isCarregando: boolean;
    recursosInternos: RecursosInternosState | null;
    selecionarArquivo: (arquivo: File) => Promise<void>;
    limpar: () => void;
    enviar: () => void;
    isEnviando: boolean;
};

// deveria estar reutilizando de mimeFromFormato (types-nora-api)
function formatoFromFile(file: File): FormatoUploadArquivo | null {
    if (file.type === 'image/webp') return 'webp';
    if (file.type === 'image/svg+xml') return 'svg';
    if (file.type === 'image/png') return 'png';
    return null;
};

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
};

function proporcaoValida(largura: number, altura: number, regra: { largura: number; altura: number; toleranciaPercentual?: number }) {
    const proporcaoEsperada = regra.largura / regra.altura;
    const proporcaoAtual = largura / altura;
    const tolerancia = (regra.toleranciaPercentual ?? 0) / 100;
    if (tolerancia <= 0) return proporcaoAtual === proporcaoEsperada;
    const diffRelativo = Math.abs(proporcaoAtual - proporcaoEsperada) / proporcaoEsperada;
    return diffRelativo <= tolerancia;
};

const ContextoUploadImagem = createContext<ContextoUploadImagemProps | undefined>(undefined);

export const useContextoUploadImagem = (): ContextoUploadImagemProps => {
    const context = useContext(ContextoUploadImagem);
    if (!context) throw new Error('useContextoUploadImagem precisa estar dentro de um ContextoUploadImagem');
    return context;
};

export default function RecipienteUploader({ tipoArquivo, camposExtrasFixos }: { tipoArquivo: TipoArquivoDef; camposExtrasFixos?: CamposExtrasUpload; }) {
    const ComponenteUploader = resolveUploaderPorTipo(tipoArquivo);

    return (
        <CarregadorRegrasUploader tipoArquivo={tipoArquivo} camposExtrasFixos={camposExtrasFixos}>
            <ComponenteUploader />
        </CarregadorRegrasUploader>
    );
};

function CarregadorRegrasUploader({ tipoArquivo, camposExtrasFixos, children }: { tipoArquivo: TipoArquivoDef; camposExtrasFixos?: CamposExtrasUpload; children: ReactNode; }) {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [regras, setRegras] = useState<RegrasUploadArquivo | null>(null);

    async function buscaRegrasUploader() {
        setCarregando('Buscando Regras para esse Uploader');

        try {
            setRegras(await buscaRegrasPorTipoArquivo(tipoArquivo));
        } catch {
            setRegras(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaRegrasUploader();
    }, []);

    if (carregando) return <div>{carregando}</div>;
    if (!regras) return <div>Não foi possível carregar as regras de upload</div>;

    const validacaoRegras = validarRegrasUploadArquivo(regras);
    if (!validacaoRegras.ok) throw new Error(`RegrasUploadArquivo inválidas: ${validacaoRegras.erros.join(' | ')}`);

    return (
        <ContextoUploadImagemProviderInterno regras={regras} tipoArquivo={tipoArquivo} camposExtrasFixos={camposExtrasFixos}>
            {children}
        </ContextoUploadImagemProviderInterno>
    );
};
// NÃO EXPORTAR. Usado internamente por RecipienteUploader
const ContextoUploadImagemProviderInterno = ({ children, tipoArquivo, regras, camposExtrasFixos }: { children: React.ReactNode; tipoArquivo: TipoArquivoDef; regras: RegrasUploadArquivo; camposExtrasFixos?: CamposExtrasUpload; }) => {
    const accept = useMemo(() => acceptFromFormatos(regras.formatosPermitidos), [regras.formatosPermitidos]);

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [isArquivoValido, setIsArquivoValido] = useState<boolean>(false);
    const [isCarregando, setIsCarregando] = useState<boolean>(false);
    const [isEnviando, setIsEnviando] = useState<boolean>(false);

    const isRecursosInternos = tipoArquivo.id === TIPOS_ARQUIVO.RECURSOS_INTERNOS.id;

    const [nomeRecursoInterno, setNomeRecursoInterno] = useState<string>('');
    const [erroNomeRecursoInterno, setErroNomeRecursoInterno] = useState<string | null>(null);

    const recursosInternos = useMemo<RecursosInternosState | null>(() => {
        if (!isRecursosInternos) return null;
        return { nome: nomeRecursoInterno, setNome: (v) => { setNomeRecursoInterno(v); if (erroNomeRecursoInterno) setErroNomeRecursoInterno(null); }, erro: erroNomeRecursoInterno };
    }, [isRecursosInternos, nomeRecursoInterno, erroNomeRecursoInterno]);

    const nomeRecursoInternoOk = useMemo(() => {
        if (!isRecursosInternos) return true;
        return nomeRecursoInterno.trim().length > 0;
    }, [isRecursosInternos, nomeRecursoInterno]);

    const isValido = useMemo(() => {
        return isArquivoValido && nomeRecursoInternoOk;
    }, [isArquivoValido, nomeRecursoInternoOk]);

    const previewUrlRef = useRef<string | null>(null);

    const limpar = useCallback(() => {
        setArquivo(null);
        setErro(null);
        setIsArquivoValido(false);
        setIsCarregando(false);
        setPreviewUrl(null);
        setNomeRecursoInterno('');
        setErroNomeRecursoInterno(null);
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
        setIsArquivoValido(false);

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
        setIsArquivoValido(true);
        setIsCarregando(false);
    }, [validarArquivo, limpar]);

    useEffect(() => {
        if (!isRecursosInternos) return;
        if (erroNomeRecursoInterno && nomeRecursoInterno.trim().length > 0) setErroNomeRecursoInterno(null);
    }, [isRecursosInternos, erroNomeRecursoInterno, nomeRecursoInterno]);

    function obtemCamposExtrasParaUploadAtual(): CamposExtrasUpload {
        const camposExtrasLocais: CamposExtrasUpload = {};

        if (isRecursosInternos) camposExtrasLocais.nomeRecursoInterno = nomeRecursoInterno.trim();

        return { ...(camposExtrasFixos ?? {}), ...camposExtrasLocais };
    };

    async function enviar(): Promise<void> {
        if (isEnviando) return;

        if (!isValido) {
            if (isRecursosInternos && nomeRecursoInterno.trim().length === 0) setErroNomeRecursoInterno('Campo obrigatório.');
            return;
        }

        if (!arquivo) {
            alert('Selecione um arquivo primeiro');
            return;
        }

        setIsEnviando(true);

        try {
            const camposExtras = obtemCamposExtrasParaUploadAtual();

            await me_upload({ arquivo, tipoArquivo, camposExtras });

            await toast.sucesso('Upload realizado', `Arquivo ${arquivo.name} foi importado com sucesso.`, { recarregaPagina: true });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Falha ao realizar upload';
            await toast.erro('Falha ao realizar upload', msg);
        } finally {
            setIsEnviando(false);
        }
    };

    const value = useMemo<ContextoUploadImagemProps>(() => {
        return { regras, accept, tipoArquivo, arquivo, previewUrl, erro, isValido, isCarregando, recursosInternos, selecionarArquivo, limpar, enviar, isEnviando };
    }, [regras, accept, tipoArquivo, arquivo, previewUrl, erro, isValido, isCarregando, recursosInternos, selecionarArquivo, limpar, enviar, isEnviando]);

    return (
        <ContextoUploadImagem.Provider value={value}>
            {children}
        </ContextoUploadImagem.Provider>
    );
};