import styles from './styles.module.css';

import { GrupoAventuraDto, SessaoDto } from 'types-nora-api';

import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type CabecalhoProps = | { tipo: 'sessao'; sessao: SessaoDto; } | { tipo: 'grupoAventura'; grupoAventura: GrupoAventuraDto; };

export function CabecalhoDeAventura(props: CabecalhoProps) { return props.tipo === 'sessao' ? <RenderCabecalhoDeSessao sessao={props.sessao} /> : <RenderCabecalhoDeGrupo grupoAventura={props.grupoAventura} /> };

function RenderCabecalhoDeSessao({ sessao }: { sessao: SessaoDto; }) {
  return (
    <>
      <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
        <RecipienteImagem src={sessao.pathCapaInteligente} />
      </SecaoDeConteudo>
    </>
  );
};

function RenderCabecalhoDeGrupo({ grupoAventura }: { grupoAventura: GrupoAventuraDto }) {
  return (
    <>
      <SecaoDeConteudo id={styles.recipiente_capa_cabecalho_aventura}>
        <RecipienteImagem src={grupoAventura.aventura.imagemCapa?.fullPath} />
      </SecaoDeConteudo>
    </>
  );
};