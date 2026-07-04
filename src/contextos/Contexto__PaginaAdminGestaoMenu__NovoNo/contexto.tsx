'use client';

import { useMemo, useState } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { MenuDoBancoDto, MenuNoDoBancoDto } from 'types-nora-api';
import { useContexto__PaginaAdminGestaoMenu, type AlvoNovoNo } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__NovoNo from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__NovoNo/SPA__PaginaAdminGestaoMenu__NovoNo';

// Subfluxo NovoNo: criação de um nó (item/grupo) num alvo (menu + pai) já escolhido na estrutura. Form ConteudoForm; dono do estado do form.
export const Contexto__PaginaAdminGestaoMenu__NovoNo__Provider = () => {
    const { alvoNovoNo, navegacao, paginas, salvando, adicionarNo, voltarParaEstrutura } = useContexto__PaginaAdminGestaoMenu();
    const [titulo, setTitulo] = useState<string>('');
    const [paginaTemplate, setPaginaTemplate] = useState<string>('');

    const menuChave = useMemo(() => (navegacao ?? []).find(m => m.id === alvoNovoNo?.fkMenusId)?.chave ?? '', [navegacao, alvoNovoNo?.fkMenusId]);
    const proximaOrdem = useMemo(() => alvoNovoNo ? calcularProximaOrdem(navegacao, alvoNovoNo) : 0, [navegacao, alvoNovoNo]);

    // Título estável da PÁGINA; subtítulo detalha ação + alvo (o menu); X volta pra estrutura.
    useConfigurarLayoutContextualizado({
        subtitulo: `Novo ${alvoNovoNo?.tipo === 'grupo' ? 'grupo' : 'item'} · ${menuChave}`,
        fecharProps: { tipo: 'acao', executar: voltarParaEstrutura, tituloTooltip: 'Voltar para a estrutura' },
    });

    if (!alvoNovoNo) return null;
    const alvo = alvoNovoNo;

    async function criar(): Promise<void> {
        await adicionarNo({ fkMenusId: alvo.fkMenusId, fkMenusNosId: alvo.fkMenusNosId, tipo: alvo.tipo, titulo: titulo.trim(), paginaTemplate: alvo.tipo === 'item' ? paginaTemplate : null, ordem: proximaOrdem });
    };

    return (
        <SPA__PaginaAdminGestaoMenu__NovoNo
            tipo={alvo.tipo}
            titulo={titulo}
            aoMudarTitulo={setTitulo}
            paginaTemplate={paginaTemplate}
            aoMudarPaginaTemplate={setPaginaTemplate}
            paginas={paginas}
            salvando={salvando}
            criar={criar}
            cancelar={voltarParaEstrutura}
        />
    );
};

function calcularProximaOrdem(navegacao: MenuDoBancoDto[] | null, alvo: AlvoNovoNo): number {
    if (navegacao === null) return 0;
    const menu = navegacao.find(m => m.id === alvo.fkMenusId);
    if (!menu) return 0;
    const irmaos = alvo.fkMenusNosId === null ? menu.nos : (acharNo(menu.nos, alvo.fkMenusNosId)?.filhos ?? []);
    return irmaos.reduce((maior, no) => Math.max(maior, no.ordem), -1) + 1;
};

function acharNo(nos: readonly MenuNoDoBancoDto[], id: number): MenuNoDoBancoDto | null {
    for (const no of nos) {
        if (no.id === id) return no;
        const achado = acharNo(no.filhos, id);
        if (achado) return achado;
    }
    return null;
};
