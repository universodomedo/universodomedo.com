import { GrupoAventuraCompletaDto } from 'types-nora-api';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import RecipienteAventuraOuSessao__ItemListagem from 'Componentes/ElementosVisuais/RecipienteAventuraOuSessao__ItemListagem/RecipienteAventuraOuSessao__ItemListagem';

export function AventuraEmLayoutContextualizado({ grupoAventura, destino, escondeEstado = false }: { grupoAventura: GrupoAventuraCompletaDto; destino: DestinoInput; escondeEstado?: boolean }) {
    return <RecipienteAventuraOuSessao__ItemListagem destino={destino} imagem={grupoAventura.aventura.imagemCapa?.fullPath!} detalhePrincipal={grupoAventura.nomeUnicoGrupoAventura} detalheSecundario={grupoAventura.estadoAtual} />;
};