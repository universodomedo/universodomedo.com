import styles from './styles.module.css';

import { type ReactNode } from 'react';

// Estrutura padrão de um fluxo "corpo + ações": AreaCorpo preenche o espaço; AreaBotoes é o rodapé padronizado (centralizado, fixo na base, separador) que ESTILIZA os <button> que recebe (on-brand; variante via data-variante="secundario"|"perigo", default = primário).
// Compound: <ConteudoForm><ConteudoForm.AreaCorpo>…</ConteudoForm.AreaCorpo><ConteudoForm.AreaBotoes>…</ConteudoForm.AreaBotoes></ConteudoForm>.
// Reutilizar em TODA página/fluxo com ações — NUNCA reimplementar o rodapé de ações na mão.
function ConteudoForm({ children }: { children: ReactNode; }) {
    return <div className={styles.conteudo_form}>{children}</div>;
};

function AreaCorpo({ children }: { children: ReactNode; }) {
    return <div className={styles.area_corpo}>{children}</div>;
};

function AreaBotoes({ children }: { children: ReactNode; }) {
    return <div className={styles.area_botoes}>{children}</div>;
};

ConteudoForm.AreaCorpo = AreaCorpo;
ConteudoForm.AreaBotoes = AreaBotoes;

export { ConteudoForm };
