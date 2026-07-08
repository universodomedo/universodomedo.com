'use client';

import { useState } from 'react';

import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__NovoMenu from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__NovoMenu/SPA__PaginaAdminGestaoMenu__NovoMenu';

// Subfluxo NovoMenu: criação de um menu nomeado (principal/interno), acionado pela listagem. Form ConteudoForm; dono do estado do form. Layout contextual é do Controlador de Fluxo.
export const Contexto__PaginaAdminGestaoMenu__NovoMenu__Provider = () => {
    const { salvando, criarMenu, voltarParaListagem } = useContexto__PaginaAdminGestaoMenu();
    const [chave, setChave] = useState<string>('');
    const [tipo, setTipo] = useState<'principal' | 'interno'>('interno');
    const [descricao, setDescricao] = useState<string>('');

    async function criar(): Promise<void> {
        await criarMenu({ chave: chave.trim(), tipo, descricao: descricao.trim() === '' ? null : descricao.trim() });
    };

    return (
        <SPA__PaginaAdminGestaoMenu__NovoMenu
            chave={chave}
            aoMudarChave={setChave}
            tipo={tipo}
            aoMudarTipo={setTipo}
            descricao={descricao}
            aoMudarDescricao={setDescricao}
            salvando={salvando}
            criar={criar}
            cancelar={voltarParaListagem}
        />
    );
};
