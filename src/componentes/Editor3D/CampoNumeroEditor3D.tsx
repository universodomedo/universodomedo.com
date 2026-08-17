'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from 'react';

// Mecânica de trava de eixo (linhas do painel Transform): o RÓTULO é o toggle (o input segue editável — a trava governa
// só o gesto). `emModo` acende a barrinha da cor do eixo DENTRO do input (sombra interna: zero deslocamento de layout);
// `inicioPoco`/`fimPoco` delimitam a série contígua de linhas travadas, que rende como UM poço rebaixado só.
interface TravaCampoNumeroEditor3D {
    readonly ativa: boolean;
    readonly corEixo: string;
    readonly emModo: boolean;
    readonly inicioPoco: boolean;
    readonly fimPoco: boolean;
    readonly aoAlternar: () => void;
};

interface CampoNumeroEditor3DProps {
    readonly rotulo: string;
    readonly valor: number;
    readonly passo: number;
    readonly atualizaValor: (valor: number) => void;
    readonly minimo?: number;
    readonly maximo?: number;
    readonly inteiro?: boolean;
    readonly desabilitado?: boolean;
    // Explicação do campo no "?" ao lado do rótulo — o inspetor é estreito: texto corrido vira ruído, tooltip só aparece quando pedido.
    readonly ajuda?: string;
    readonly trava?: TravaCampoNumeroEditor3D;
};

// Barrinha esmaecida do eixo travado: mesma cor com alpha (esmaece junto com a linha, sem sumir).
function corEixoEsmaecida(corHex: string): string {
    const r = parseInt(corHex.slice(1, 3), 16);
    const g = parseInt(corHex.slice(3, 5), 16);
    const b = parseInt(corHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.32)`;
};

function obtemCasasDecimais(passo: number): number { return String(passo).split('.')[1]?.length ?? 0; };
function aplicaMinimoMaximo(valor: number, minimo?: number, maximo?: number): number { return Math.min(maximo ?? valor, Math.max(minimo ?? valor, valor)); };

function normalizaNumero(valor: number, passo: number, inteiro: boolean, minimo?: number, maximo?: number): number {
    const valorLimitado = aplicaMinimoMaximo(valor, minimo, maximo);
    if (inteiro) return Math.floor(valorLimitado);
    return Number(valorLimitado.toFixed(obtemCasasDecimais(passo)));
};

function formataValor(valor: number, passo: number, inteiro: boolean, minimo?: number, maximo?: number): string { return String(normalizaNumero(valor, passo, inteiro, minimo, maximo)); };

function converteTextoNumero(valorTexto: string): number | null {
    const texto = valorTexto.trim().replace(',', '.');
    if (texto === '' || texto === '-' || texto === '+' || texto === '.' || texto === '-.' || texto === '+.') return null;
    const valor = Number(texto);
    return Number.isFinite(valor) ? valor : null;
};

interface InputNumeroEditor3DProps {
    readonly valor: number;
    readonly passo: number;
    readonly atualizaValor: (valor: number) => void;
    readonly minimo?: number;
    readonly maximo?: number;
    readonly inteiro?: boolean;
    readonly desabilitado?: boolean;
    readonly estilo?: CSSProperties;
    readonly titulo?: string;
};

// O INPUT numérico em si (digitação livre + setas com passo, ×10 no Shift, Esc restaura): extraído para ser reusado por
// quem monta outras formas de campo — a linha rótulo+valor (`CampoNumeroEditor3D`) e a linha de FAIXA mín–máx
// (`CampoFaixaEditor3D`), sem duplicar a normalização.
export function InputNumeroEditor3D({ valor, passo, atualizaValor, minimo, maximo, inteiro = false, desabilitado = false, estilo, titulo }: InputNumeroEditor3DProps) {
    const [valorTexto, setValorTexto] = useState(() => formataValor(valor, passo, inteiro, minimo, maximo));
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (!editando) setValorTexto(formataValor(valor, passo, inteiro, minimo, maximo));
    }, [valor, passo, inteiro, minimo, maximo, editando]);

    function confirmaValor(valorCru: number): void {
        const valorFinal = normalizaNumero(valorCru, passo, inteiro, minimo, maximo);
        setValorTexto(String(valorFinal));
        atualizaValor(valorFinal);
    };

    function alteraTexto(event: ChangeEvent<HTMLInputElement>): void {
        const proximoTexto = event.target.value;
        const proximoValor = converteTextoNumero(proximoTexto);
        setValorTexto(proximoTexto);
        if (proximoValor !== null) atualizaValor(normalizaNumero(proximoValor, passo, inteiro, minimo, maximo));
    };

    function finalizaEdicao(): void {
        const proximoValor = converteTextoNumero(valorTexto);
        setEditando(false);
        if (proximoValor === null) setValorTexto(formataValor(valor, passo, inteiro, minimo, maximo));
        else confirmaValor(proximoValor);
    };

    function aplicaSeta(event: KeyboardEvent<HTMLInputElement>): boolean {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;
        const valorAtual = converteTextoNumero(valorTexto) ?? valor;
        const direcao = event.key === 'ArrowUp' ? 1 : -1;
        const multiplicador = event.shiftKey ? 10 : 1;
        confirmaValor(valorAtual + (passo * direcao * multiplicador));
        event.preventDefault();
        return true;
    };

    function aplicaTecla(event: KeyboardEvent<HTMLInputElement>): void {
        event.stopPropagation();
        if (aplicaSeta(event)) return;
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
            setValorTexto(formataValor(valor, passo, inteiro, minimo, maximo));
            setEditando(false);
            event.currentTarget.blur();
        }
    };

    return <input type="text" inputMode={inteiro ? 'numeric' : 'decimal'} value={valorTexto} disabled={desabilitado} style={estilo} title={titulo} onFocus={() => setEditando(true)} onChange={alteraTexto} onBlur={finalizaEdicao} onKeyDown={aplicaTecla} />;
};

export function CampoNumeroEditor3D({ rotulo, valor, passo, atualizaValor, minimo, maximo, inteiro = false, desabilitado = false, ajuda, trava }: CampoNumeroEditor3DProps) {
    const classesLinha = [styles.campo_numero];
    if (trava?.ativa) {
        classesLinha.push(styles.campo_numero_travado);
        if (trava.inicioPoco) classesLinha.push(styles.campo_numero_travado_inicio);
        if (trava.fimPoco) classesLinha.push(styles.campo_numero_travado_fim);
    }
    // Barrinha do eixo dentro do input (borda esquerda, via sombra interna): acesa no modo que edita este grupo; travada = esmaecida junto com a linha.
    const estiloInput = trava?.emModo ? { boxShadow: `inset 0.28em 0 0 ${trava.ativa ? corEixoEsmaecida(trava.corEixo) : trava.corEixo}` } : undefined;

    // preventDefault: cancela o comportamento padrão do <label> (focar o input) — clicar no RÓTULO tranca/destranca; clicar no INPUT edita.
    function alternaTrava(evento: { preventDefault: () => void; stopPropagation: () => void }): void {
        evento.preventDefault();
        evento.stopPropagation();
        trava?.aoAlternar();
    };

    return (
        <label className={classesLinha.join(' ')}>
            {trava !== undefined ? (
                <span className={styles.rotulo_travavel} title={trava.ativa ? 'Destravar: o gesto volta a alterar este eixo' : 'Travar: o gesto não altera este eixo'} onClick={alternaTrava}>{rotulo}</span>
            ) : (
                <span>{rotulo}{ajuda !== undefined && <button type="button" className={styles.ajuda_campo} title={ajuda} aria-label={ajuda} onClick={evento => evento.preventDefault()}>?</button>}</span>
            )}
            <InputNumeroEditor3D valor={valor} passo={passo} atualizaValor={atualizaValor} minimo={minimo} maximo={maximo} inteiro={inteiro} desabilitado={desabilitado} estilo={estiloInput} />
        </label>
    );
};
