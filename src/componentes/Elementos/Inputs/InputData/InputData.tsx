'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import styles from './styles.module.css';

type InputDataProps = {
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
    erro?: string;
    limparHabilitado?: boolean;
    min?: Date;
    max?: Date;
    formatoDisplay?: string;
};

type PopoverPos = { top: number; left: number; width: number };

export function InputData(props: InputDataProps) {
    const [aberto, setAberto] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [pos, setPos] = useState<PopoverPos | null>(null);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const formato = props.formatoDisplay ?? 'dd-MM-yyyy';

    const texto = useMemo(() => {
        if (!props.value) return props.placeholder ?? 'Selecione uma data';
        return format(props.value, formato, { locale: ptBR });
    }, [props.value, props.placeholder, formato]);

    useEffect(() => { setMounted(true); }, []);

    function recalcularPos() {
        const el = buttonRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setPos({ top: r.bottom, left: r.left, width: r.width });
    }

    useEffect(() => {
        if (!aberto) return;
        recalcularPos();

        function onResizeOrScroll() { recalcularPos(); }
        window.addEventListener('resize', onResizeOrScroll);
        window.addEventListener('scroll', onResizeOrScroll, true);

        return () => {
            window.removeEventListener('resize', onResizeOrScroll);
            window.removeEventListener('scroll', onResizeOrScroll, true);
        };
    }, [aberto]);

    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (!aberto) return;

            const root = rootRef.current;
            const pop = popoverRef.current;

            if (e.target instanceof Node) {
                if (root && root.contains(e.target)) return;
                if (pop && pop.contains(e.target)) return;
            }

            setAberto(false);
        }

        function onKey(e: KeyboardEvent) {
            if (!aberto) return;
            if (e.key === 'Escape') setAberto(false);
        }

        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [aberto]);

    function escolher(d: Date | undefined) {
        if (!d) return;
        const safe = withSafeTime(d);
        const clamped = clampDate(safe, props.min ?? null, props.max ?? null);
        props.onChange(clamped);
        setAberto(false);
    }

    function limpar() {
        props.onChange(null);
        setAberto(false);
    }

    const hiddenValue = props.value ? props.value.toISOString() : '';

    const popover = (mounted && aberto && pos) ? createPortal(
        <div
            ref={popoverRef}
            className={styles.popover}
            style={{ top: `calc(${pos.top}px + 0.5em)`, left: `${pos.left}px`, width: `${pos.width}px` }}
            role="dialog"
            aria-label="Selecionar data"
        >
            <DayPicker
                mode="single"
                locale={ptBR}
                selected={props.value ?? undefined}
                onSelect={(d) => escolher(d)}
                disabled={[
                    ...(props.min ? [{ before: props.min }] : []),
                    ...(props.max ? [{ after: props.max }] : []),
                ]}
                defaultMonth={props.value ?? props.min ?? undefined}
                weekStartsOn={1}
            />
        </div>,
        document.body,
    ) : null;

    return (
        <div ref={rootRef} className={styles.root}>
            <div className={cn(styles.field, props.erro ? styles.fieldErro : null, props.disabled ? styles.fieldDisabled : null)}>
                <button
                    ref={buttonRef}
                    type="button"
                    className={styles.button}
                    onClick={() => setAberto(!aberto)}
                    disabled={props.disabled}
                    aria-haspopup="dialog"
                    aria-expanded={aberto}
                >
                    <span className={cn(styles.texto, props.value ? styles.textoAtivo : styles.textoPlaceholder)}>{texto}</span>
                    <span className={styles.icone} aria-hidden="true">📅</span>
                </button>

                <input type="hidden" value={hiddenValue} />

                {props.limparHabilitado && props.value && !props.disabled ? <button type="button" className={styles.clear} onClick={limpar} aria-label="Limpar data">✕</button> : null}
            </div>

            {props.erro ? <div className={styles.erro}>{props.erro}</div> : null}

            {popover}
        </div>
    );
};

function clampDate(d: Date, minDate: Date | null, maxDate: Date | null): Date {
    const t = d.getTime();
    const minT = minDate ? minDate.getTime() : null;
    const maxT = maxDate ? maxDate.getTime() : null;
    if (minT !== null && t < minT) return minDate as Date;
    if (maxT !== null && t > maxT) return maxDate as Date;
    return d;
};

function withSafeTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
};