'use client';

import { useState } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__NovoMenu from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__NovoMenu/SPA__PaginaAdminGestaoMenu__NovoMenu';

// Subfluxo NovoMenu: criação de um menu nomeado (principal/interno). Form ConteudoForm; dono do estado do form.
export const Contexto__PaginaAdminGestaoMenu__NovoMenu__Provider = () => {
    const { salvando, criarMenu, voltarParaEstrutura } = useContexto__PaginaAdminGestaoMenu();
    const [chave, setChave] = useState<string>('');
    const [tipo, setTipo] = useState<'principal' | 'interno'>('interno');
    const [descricao, setDescricao] = useState<string>('');

    // Título estável da PÁGINA; subtítulo detalha a ação; X volta pra estrutura.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Novo menu',
        fecharProps: { tipo: 'acao', executar: voltarParaEstrutura, tituloTooltip: 'Voltar para a estrutura' },
    });

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
            cancelar={voltarParaEstrutura}
        />
    );
};
