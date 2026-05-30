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
];
