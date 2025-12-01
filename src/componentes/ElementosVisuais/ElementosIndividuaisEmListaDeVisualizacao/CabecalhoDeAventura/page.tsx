import styles from './styles.module.css';

import { EstiloSessao, GrupoAventuraDto, SessaoDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type CabecalhoProps = | { tipo: 'sessao'; sessao: SessaoDto; } | { tipo: 'grupoAventura'; grupoAventura: GrupoAventuraDto; };

export function CabecalhoDeAventura(props: CabecalhoProps) {
  return props.tipo === 'sessao'
    ? props.sessao.estiloSessao === EstiloSessao.SESSAO_DE_AVENTURA
      ? <CabecalhoDeAventura tipo={'grupoAventura'} grupoAventura={props.sessao.detalheSessaoAventura.grupoAventura} />
      : <RenderCabecalhoDeAventura pathCapa={''} titulo={props.sessao.detalheSessaoUnica.rascunho?.titulo ?? 'Mundo Aberto'} />
    : <RenderCabecalhoDeAventura pathCapa={props.grupoAventura.aventura.imagemCapa!.fullPath} titulo={props.grupoAventura.nomeUnicoGrupoAventura} />
};

function RenderCabecalhoDeAventura({ pathCapa, titulo }: { pathCapa: string; titulo: string }) {
  return (
    <>
      <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
        <RecipienteImagem src={pathCapa} />
      </SecaoDeConteudo>

      <SecaoDeConteudo id={styles.recipiente_nome_cabecalho_aventura}>
        <h1>{titulo}</h1>
      </SecaoDeConteudo>
    </>
  );
};