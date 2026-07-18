// Registro central de módulos de ação da BarraAcoesFlutuante.
//
// Cada módulo declara:
//   Registrador — componente null que registra/remove a ação dinamicamente (ex: verifica auth)
//   Painel      — componente que renderiza o conteúdo aberto pela ação (ex: painel do chat)
//
// Para adicionar uma nova ação com painel:
//   1. Crie seu Registrador (chama registrarAcao/removerAcao conforme condições)
//   2. Crie seu Painel (auto-gerencia visibilidade via contexto próprio)
//   3. Adicione uma entrada aqui

import type { ComponentType } from 'react';
import { RegistradorAcaoChat } from 'Componentes/Elementos/Chat/RegistradorAcaoChat';
import ComponenteChat from 'Componentes/Elementos/Chat/Chat';
import { RegistradorAcaoUsuariosOnline } from 'Componentes/ElementosGlobais/SecaoUsuariosExistentes/RegistradorAcaoUsuariosOnline';
import PainelUsuariosOnline from 'Componentes/ElementosGlobais/SecaoUsuariosExistentes/PainelUsuariosOnline';
import { RegistradorAcaoNotificacoes } from 'Componentes/Elementos/EventosUsuarioCentral/RegistradorAcaoNotificacoes';
import { RegistradorAcaoCentralAudio } from 'Componentes/Elementos/CentralAudio/RegistradorAcaoCentralAudio';
import PainelCentralAudio from 'Componentes/Elementos/CentralAudio/PainelCentralAudio';
import { RegistradorAcaoControlePalco } from 'Componentes/Elementos/ControlePalco/RegistradorAcaoControlePalco';
import PainelControlePalco from 'Componentes/Elementos/ControlePalco/PainelControlePalco';
import { RegistradorAcaoResumoPainelDoMedo } from 'Componentes/Elementos/ResumoPainelDoMedo/RegistradorAcaoResumoPainelDoMedo';
import PainelResumoPainelDoMedo from 'Componentes/Elementos/ResumoPainelDoMedo/PainelResumoPainelDoMedo';

export interface ModuloAcao {
    id: string;
    Registrador?: ComponentType;
    Painel?: ComponentType;
};

export const MODULOS_ACOES: ModuloAcao[] = [
    {
        id: 'chat',
        Registrador: RegistradorAcaoChat,
        Painel: ComponenteChat,
    },
    {
        id: 'usuarios-online',
        Registrador: RegistradorAcaoUsuariosOnline,
        Painel: PainelUsuariosOnline,
    },
    {
        id: 'notificacoes',
        Registrador: RegistradorAcaoNotificacoes,
    },
    {
        id: 'central-audio',
        Registrador: RegistradorAcaoCentralAudio,
        Painel: PainelCentralAudio,
    },
    {
        id: 'controle-palco',
        Registrador: RegistradorAcaoControlePalco,
        Painel: PainelControlePalco,
    },
    {
        id: 'resumo-painel-do-medo',
        Registrador: RegistradorAcaoResumoPainelDoMedo,
        Painel: PainelResumoPainelDoMedo,
    },
];
