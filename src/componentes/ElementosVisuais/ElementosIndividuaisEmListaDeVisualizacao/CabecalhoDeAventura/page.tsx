import styles from './styles.module.css';

import { CaminhoArquivoArte, GrupoAventuraCompletaDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type CabecalhoProps = | { tipo: 'sessao'; caminhoCapaSessao: CaminhoArquivoArte; } | { tipo: 'grupoAventura'; grupoAventura: GrupoAventuraCompletaDto; };

export function CabecalhoDeAventura(props: CabecalhoProps) { return props.tipo === 'sessao' ? <RenderCabecalho caminhoArquivoArte={props.caminhoCapaSessao} /> : <RenderCabecalho caminhoArquivoArte={props.grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} /> };

function RenderCabecalho({ caminhoArquivoArte }: { caminhoArquivoArte: CaminhoArquivoArte }) {
  return (
    <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
      <RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArte} />
    </SecaoDeConteudo>
  );
};