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

      <SecaoDeConteudo id={styles.recipiente_nome_cabecalho_aventura}>
        <h1>{sessao.tituloInteligente.titulo}</h1>
        {sessao.tituloInteligente.subtitulo && (<h3>{sessao.tituloInteligente.titulo}</h3>)}
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

      <SecaoDeConteudo id={styles.recipiente_nome_cabecalho_aventura}>
        <h1>{grupoAventura.nomeUnicoGrupoAventura}</h1>
      </SecaoDeConteudo>
    </>
  );
};