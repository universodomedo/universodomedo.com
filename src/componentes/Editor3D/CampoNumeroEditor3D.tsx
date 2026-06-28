'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';

interface CampoNumeroEditor3DProps {
    readonly rotulo: string;
    readonly valor: number;
    readonly passo: number;
    readonly atualizaValor: (valor: number) => void;
    readonly minimo?: number;
    readonly maximo?: number;
    readonly inteiro?: boolean;
    readonly desabilitado?: boolean;
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

export function CampoNumeroEditor3D({ rotulo, valor, passo, atualizaValor, minimo, maximo, inteiro = false, desabilitado = false }: CampoNumeroEditor3DProps) {
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

    return (
        <label className={styles.campo_numero}>
            <span>{rotulo}</span>
            <input type="text" inputMode={inteiro ? 'numeric' : 'decimal'} value={valorTexto} disabled={desabilitado} onFocus={() => setEditando(true)} onChange={alteraTexto} onBlur={finalizaEdicao} onKeyDown={aplicaTecla} />
        </label>
    );
};
