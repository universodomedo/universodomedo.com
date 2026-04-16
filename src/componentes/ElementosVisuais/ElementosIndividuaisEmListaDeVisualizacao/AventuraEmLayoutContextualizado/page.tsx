import { VIEW_GrupoAventuraListagem } from 'types-nora-api';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import RecipienteAventuraOuSessao__ItemListagem from 'Componentes/ElementosVisuais/RecipienteAventuraOuSessao__ItemListagem/RecipienteAventuraOuSessao__ItemListagem';

export function AventuraEmLayoutContextualizado({ grupoAventura, destino }: { grupoAventura: VIEW_GrupoAventuraListagem; destino: DestinoInput; }) {
    return <RecipienteAventuraOuSessao__ItemListagem destino={destino} caminhoCapa={grupoAventura.imagemCapa.caminhoCapa} detalhePrincipal={grupoAventura.nomeUnicoGrupoAventura} detalheSecundario={grupoAventura.estadoAtual} />;
};