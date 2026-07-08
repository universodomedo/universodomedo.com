'use client';

import { useState } from 'react';

import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__EdicaoMenu from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__EdicaoMenu/SPA__PaginaAdminGestaoMenu__EdicaoMenu';

// Subfluxo EdicaoMenu: edita a descrição de um menu + Ativar/Inativar menu (persistido na hora; menu inativo some das páginas). Form ConteudoForm. Layout contextual é do Controlador de Fluxo.
export const Contexto__PaginaAdminGestaoMenu__EdicaoMenu__Provider = () => {
    const { menuEmEdicao, salvando, editarMenu, voltarParaEstrutura } = useContexto__PaginaAdminGestaoMenu();
    const [descricao, setDescricao] = useState<string>(menuEmEdicao?.descricao ?? '');
    const [ativo, setAtivo] = useState<boolean>(menuEmEdicao?.ativo ?? true);

    if (!menuEmEdicao) return null;
    const idMenu = menuEmEdicao.id;

    async function salvar(): Promise<void> {
        await editarMenu(idMenu, { descricao: descricao.trim() === '' ? null : descricao.trim() });
        voltarParaEstrutura();
    };

    async function alternarAtivo(): Promise<void> {
        const novo = !ativo;
        await editarMenu(idMenu, { ativo: novo });
        setAtivo(novo);
    };

    return (
        <SPA__PaginaAdminGestaoMenu__EdicaoMenu
            descricao={descricao}
            aoMudarDescricao={setDescricao}
            ativo={ativo}
            salvando={salvando}
            salvar={salvar}
            alternarAtivo={alternarAtivo}
            cancelar={voltarParaEstrutura}
        />
    );
};
