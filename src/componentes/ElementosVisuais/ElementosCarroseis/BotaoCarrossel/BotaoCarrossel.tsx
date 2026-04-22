import styles from './styles.module.css';

import { ArquivoInternoDef } from 'types-nora-api';

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';

type BotaoCarrosselProps = {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    classNameExterno?: string;
    arquivo: ArquivoInternoDef;
};

export default function BotaoCarrossel({ onClick, classNameExterno, arquivo }: BotaoCarrosselProps) {
    return <div className={` ${styles.botao} ${classNameExterno}`} onClick={onClick} style={{ ['--botao-imagem' as never]: `url("${carregaArquivoInterno(arquivo)}")` }}/>
};