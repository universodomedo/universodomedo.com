// #region Imports
import style from "./style.module.css";
import React, { useEffect, useState, ReactNode, createContext, useContext, forwardRef, useImperativeHandle, useRef } from 'react';
import { LoadingContext } from "Components/LayoutAbas/hooks.ts";
// #endregion

const ContextoAba = createContext<{ abasAbertas: string[]; alternaAba: (idAba: string) => void; } | undefined>(undefined);
const Abas: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [abasAbertas, setAbasAbertas] = useState<string[]>([]);

    const alternaAba = (idAba: string) => {
        setAbasAbertas((abasAbertasAnteriormente) =>
            abasAbertasAnteriormente.includes(idAba)
                ? abasAbertasAnteriormente.filter((id) => id !== idAba)
                : [...abasAbertasAnteriormente, idAba]
        );
    };

    return (
        <ContextoAba.Provider value={{ abasAbertas, alternaAba }}>
            <div className={style.componente_abas}>{children}</div>
        </ContextoAba.Provider>
    );
};

const ListaAbas: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <div className={style.div_botoes_abas}>{children}</div>;
};

const Aba: React.FC<{ id: string; children: ReactNode; }> = ({ id, children }) => {
    const context = useContext(ContextoAba);
    if (!context) throw new Error("A Aba precisa estar contido na organização de Abas");

    const { abasAbertas, alternaAba } = context;

    return (
        <button id={id} className={`${style.botao_aba} ${abasAbertas.includes(id) ? style.botao_aba_ativa : ''}`} onClick={() => alternaAba(id)}>
            {children}
        </button>
    );
};

const PainelAbas: React.FC<{ id: string; children: ReactNode; }> = ({ id, children }) => {
    const context = useContext(ContextoAba);
    if (!context) throw new Error("O PainelAbas precisa estar contido na organização de Abas");

    const { abasAbertas } = context;
    const abaRef = useRef<HTMLDivElement | null>(null);
    const [abasAbertasAnteriormente, setAbasAbertasAnteriormente] = useState<string[]>([]);

    useEffect(() => {
        const abaFoiAberta = !abasAbertasAnteriormente.includes(id) && abasAbertas.includes(id);

        if (abaFoiAberta && abaRef.current) {
            abaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setAbasAbertasAnteriormente(abasAbertas);
    }, [abasAbertas]);

    return abasAbertas.includes(id)
        ? <JanelaConteudoAba ref={abaRef} id={id}>{children}</JanelaConteudoAba>
        : null;
};

const JanelaConteudoAba = React.forwardRef<HTMLDivElement, { id: string; children: ReactNode }>(({ id, children }, ref) => {
    const context = useContext(ContextoAba);
    if (!context) throw new Error("A Janela precisa estar contido na organização de Abas");
    const { alternaAba } = context;

    const [loading, setLoading] = useState(true);

    const stopLoading = () => {
        setLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ loading, stopLoading }}>
            <div ref={ref} className={`${style.wrapper_aba}`}>
                <div className={style.barra_superior_conteudo_aba}>
                    <button className={style.botao_fechar_aba} onClick={() => alternaAba(id)}>x</button>
                </div>
                <div className={style.conteudo_aba}>
                    {children}
                </div>
            </div>
        </LoadingContext.Provider>
    );
});

const ControleAbasExternas = forwardRef((_, ref) => {
    const contextoAba = useContext(ContextoAba);

    if (!contextoAba) {
        throw new Error('O ControleAbasExternas precisa estar dentro de um Abas Provider');
    }

    const { alternaAba, abasAbertas } = contextoAba;

    const abreAba = (idAba: string) => {
        if (!abasAbertas.includes(idAba)) {
            alternaAba(idAba);
        }
    };

    const fechaAba = (idAba: string) => {
        if (abasAbertas.includes(idAba)) {
            alternaAba(idAba);
        }
    }

    useImperativeHandle(ref, () => ({ abreAba, fechaAba }));

    return null;
});

export { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas };