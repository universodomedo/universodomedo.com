import { ItemPermissaoDto } from 'types-nora-api';
import styles from './styles.module.css';

import type { ChangeEvent, ReactNode } from 'react';

type CampoModalProps = { label: string; children: ReactNode };

export function CampoModal({ label, children }: CampoModalProps) {
    return (
        <div className={styles.modal_criacao__recipiente_item_permissao}>
            <label className={styles.modal_criacao__label_item_permissao}>{label}</label>
            {children}
        </div>
    );
};

type TextoCodigoProps = { children: ReactNode };

function TextoCodigo({ children }: TextoCodigoProps) { return <div className={styles.modal_criacao__recipiente_descricao_item_permissao__codigo}>{children}</div>; };

type CampoInputComDicaProps = {
    value: string;
    onChangeValue: (valor: string) => void;
    placeholder: string;
    valido: boolean;
    dica: string;
};

export function CampoInputComDica({ value, onChangeValue, placeholder, valido, dica }: CampoInputComDicaProps) {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => onChangeValue(e.target.value);

    return (
        <>
            <input className={styles.input} value={value} onChange={onChange} placeholder={placeholder} />
            {!valido ? <div className={styles.dica}>{dica}</div> : null}
        </>
    );
};

export function CampoPai({ itemPermissao }: { itemPermissao: ItemPermissaoDto | null }) {
    return itemPermissao ? (
        <div className={styles.modal_criacao__recipiente_descricao_item_permissao}>
            <TextoCodigo>{itemPermissao.codigo}</TextoCodigo>
            <div className={styles.modal_criacao__recipiente_descricao_item_permissao__descricao}>{itemPermissao.descricao}</div>
            <div className={styles.modal_criacao__recipiente_descricao_item_permissao__path}>{itemPermissao.path}</div>
        </div>
    ) : (
        <TextoCodigo>RAIZ</TextoCodigo>
    );
};