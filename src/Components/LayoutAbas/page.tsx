// #region Imports
import style from "./style.module.css";
import React, { useState, ReactNode, createContext, useContext, useEffect } from 'react';
import { LoadingContext } from "Components/LayoutAbas/hooks.ts";
// #endregion

const ContextoAba = createContext<{ abasAbertas: string[]; alternaAba: (idAba: string) => void; } | undefined>(undefined);
const Abas: React.FC<{ children: ReactNode }> = ({ children }) => {
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
        <button className={`${style.botao_aba} ${abasAbertas.includes(id) ? style.botao_aba_ativa : ''}`} onClick={() => alternaAba(id)}>
            {children}
        </button>
    );
};

const PainelAbas: React.FC<{ id: string; children: ReactNode; }> = ({ id, children }) => {
    const context = useContext(ContextoAba);
    if (!context) throw new Error("O PainelAbas precisa estar contido na organização de Abas");

    const { abasAbertas } = context;

    return abasAbertas.includes(id)
        ? <JanelaConteudoAba id={id}>{children}</JanelaConteudoAba>
        : null;
};

const JanelaConteudoAba: React.FC<{ id: string; children: ReactNode }> = ({ id, children }):ReactNode => {
    const context = useContext(ContextoAba);
    if (!context) throw new Error("A Janela precisa estar contido na organização de Abas");
    const { alternaAba } = context;

    const [loading, setLoading] = useState(true);

    const stopLoading = () => {
        setLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ loading, stopLoading }}>
            <div className={`${style.wrapper_aba}`}>
                <div className={style.barra_superior_conteudo_aba}>
                    <button className={style.botao_fechar_aba} onClick={() => alternaAba(id)}>x</button>
                </div>
                <div className={style.conteudo_aba}>
                    {children}
                </div>
            </div>
        </LoadingContext.Provider>
    );
}

export { Abas, ListaAbas, Aba, PainelAbas };