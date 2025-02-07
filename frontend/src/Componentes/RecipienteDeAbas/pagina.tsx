// #region Imports
import style from './style.module.css';
import { ReactNode } from "react";
import { Tabs, Root, List, Trigger, Content } from "@radix-ui/react-tabs"
// #endregion

function RecipienteDeAbas({ children, codigoAbaDefault }: { children: ReactNode, codigoAbaDefault: string }) {
    return (
        <Root className={style.recipiente_abas} defaultValue={codigoAbaDefault}>
            {children}
        </Root>
    );
};

RecipienteDeAbas.Aba = function Abas({ children }: { children: ReactNode }) {
    return (
        <List className={style.lista_abas}>
            {children}
        </List>
    );
};

RecipienteDeAbas.Gatilho = function({ titulo, codigo }: { titulo: string, codigo: string }) {
    return (
        <Trigger className={style.aba} value={codigo}>
            {titulo}
        </Trigger>
    );
};

RecipienteDeAbas.ConteudoAba = function({ children, codigo }: { children: ReactNode, codigo: string }) {
    return (
        <Content className={style.conteudo_aba} value={codigo}>
            {children}
        </Content>
    );
};

export default RecipienteDeAbas;