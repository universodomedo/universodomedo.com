'use client';

import styles from './styles.module.css';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useAppRefresh } from 'contextos/ContextoAppRefresh/contexto';

type ToastTipo = 'sucesso' | 'aviso' | 'erro';

type ToastOpcao = { recarregaPagina?: boolean };

type ToastItem = {
    id: string;
    tipo: ToastTipo;
    titulo: string;
    mensagem?: string;
};

interface ContextoToastProps {
    sucesso: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    aviso: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    erro: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    fechar: (id: string) => void;
}

const ContextoToast = createContext<ContextoToastProps | undefined>(undefined);

export function useToast(): ContextoToastProps {
    const ctx = useContext(ContextoToast);
    if (!ctx) throw new Error('useToast precisa estar dentro de ContextoToastProvider');
    return ctx;
}

function uid() { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }

export function ContextoToastProvider({ children }: { children: React.ReactNode }) {
    const { recarregaPagina } = useAppRefresh();

    const maxVisiveis = 3;
    const [visiveis, setVisiveis] = useState<ToastItem[]>([]);
    const filaRef = useRef<ToastItem[]>([]);

    function pushVisiveis(item: ToastItem) {
        setVisiveis((curr) => {
            if (curr.length < maxVisiveis) return [...curr, item];
            filaRef.current = [...filaRef.current, item];
            return curr;
        });
    }

    function fechar(id: string) {
        setVisiveis((curr) => {
            const novo = curr.filter((t) => t.id !== id);
            if (novo.length < maxVisiveis && filaRef.current.length > 0) {
                const [proximo, ...resto] = filaRef.current;
                filaRef.current = resto;
                return [...novo, proximo];
            }
            return novo;
        });
    }

    async function add(tipo: ToastTipo, titulo: string, mensagem?: string, opcoes?: ToastOpcao) {
        if (opcoes?.recarregaPagina) {
            recarregaPagina();
            await new Promise<void>((r) => setTimeout(() => r(), 0));
        }

        pushVisiveis({ id: uid(), tipo, titulo, mensagem });
    }

    const api = useMemo<ContextoToastProps>(() => ({
        sucesso: (t, m, o) => add('sucesso', t, m, o),
        aviso: (t, m, o) => add('aviso', t, m, o),
        erro: (t, m, o) => add('erro', t, m, o),
        fechar,
    }), []);

    return (
        <ContextoToast.Provider value={api}>
            {children}

            <div className={styles.viewport}>
                {visiveis.map((t) => (
                    <div key={t.id} className={`${styles.toast} ${styles[`tipo_${t.tipo}`]}`}>
                        <div className={styles.toast_conteudo}>
                            <div className={styles.toast_titulo}>{t.titulo}</div>
                            {t.mensagem ? <div className={styles.toast_msg}>{t.mensagem}</div> : null}
                        </div>

                        <button className={styles.toast_fechar} onClick={() => fechar(t.id)}>×</button>
                    </div>
                ))}
            </div>
        </ContextoToast.Provider>
    );
};