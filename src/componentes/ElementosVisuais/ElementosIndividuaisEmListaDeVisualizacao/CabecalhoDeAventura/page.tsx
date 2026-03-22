import styles from './styles.module.css';

import { GrupoAventuraCompletaDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type CabecalhoProps = | { tipo: 'sessao'; caminhoCapaSessao: string; } | { tipo: 'grupoAventura'; grupoAventura: GrupoAventuraCompletaDto; };

export function CabecalhoDeAventura(props: CabecalhoProps) { return props.tipo === 'sessao' ? <RenderCabecalho caminhoImagem={props.caminhoCapaSessao} /> : <RenderCabecalho caminhoImagem={props.grupoAventura.imagemCapa.caminhoCapa} /> };

function RenderCabecalho({ caminhoImagem }: { caminhoImagem: string }) {
  return (
    <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
      <RecipienteImagem src={caminhoImagem} />
    </SecaoDeConteudo>
  );
};