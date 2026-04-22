import styles from './styles.module.css';

import cn from 'classnames';
import { ArquivoInternoKey, ARQUIVOS_INTERNOS } from 'types-nora-api';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

type BotaoCriacaoProps = {
    arquivoImagem: ArquivoInternoKey;
    texto: string;
    espelhar?: true;
    ativo: boolean;
    onClick?: () => void;
    bloqueadoTemporariamente?: true;
};

export default function BotaoCriacao({ arquivoImagem, texto, espelhar, ativo, onClick, bloqueadoTemporariamente }: BotaoCriacaoProps) {
    return (
        <DivClicavel className={cn(styles.recipiente_botao_criacao, espelhar && styles.espelhado, ativo && styles.ativo, bloqueadoTemporariamente && styles.bloqueado )} onClick={onClick}>
            <div className={styles.recipiente_conteudo} style={{ ['--ornamento' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.BOTAO_CRIACAO__ORNAMENTO)}")` }}>
                <p className={styles.texto}>{texto}</p>
                <RecipienteArquivoInterno arquivo={arquivoImagem} className={styles.imagem_botao_criacao} />
            </div>
            <RecipienteArquivoInterno arquivo={'BOTAO_CRIACAO__FUNDO'} className={styles.fundo_botao} />
        </DivClicavel>
    );
};