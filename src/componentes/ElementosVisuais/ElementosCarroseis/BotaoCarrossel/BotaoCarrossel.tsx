import styles from './styles.module.css'

type BotaoCarrosselProps = {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    classNameExterno?: string;
    imagemUrl: string;
}

type StyleVars = React.CSSProperties & { ['--botao-imagem']?: string };

export default function BotaoCarrossel({ onClick, classNameExterno, imagemUrl}: BotaoCarrosselProps) {
    const style: StyleVars = { ['--botao-imagem']: `url("${imagemUrl}")` };
    return <div className={` ${styles.botao} ${classNameExterno}`} onClick={onClick} style={style} />
};