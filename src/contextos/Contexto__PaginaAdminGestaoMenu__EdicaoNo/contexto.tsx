'use client';

import { useState } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContexto__PaginaAdminGestaoMenu } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__EdicaoNo from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__EdicaoNo/SPA__PaginaAdminGestaoMenu__EdicaoNo';

// Subfluxo EdicaoNo: edição de um nó (título) + ativar/inativar item (visível, persistido na hora, como o Inativar Página). Form ConteudoForm.
export const Contexto__PaginaAdminGestaoMenu__EdicaoNo__Provider = () => {
    const { noEmEdicao, salvando, editarNo, voltarParaEstrutura } = useContexto__PaginaAdminGestaoMenu();
    const [titulo, setTitulo] = useState<string>(noEmEdicao?.titulo ?? '');
    const [visivel, setVisivel] = useState<boolean>(noEmEdicao?.visivel ?? true);

    // Título estável da PÁGINA; subtítulo detalha ação + alvo (o nó); X volta pra estrutura. Identidade do nó no subtítulo, não no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: `Editar ${noEmEdicao?.tipo === 'grupo' ? 'grupo' : 'item'} · ${noEmEdicao?.titulo ?? ''}`,
        fecharProps: { tipo: 'acao', executar: voltarParaEstrutura, tituloTooltip: 'Voltar para a estrutura' },
    });

    if (!noEmEdicao) return null;
    const idNo = noEmEdicao.id;

    async function salvar(): Promise<void> {
        await editarNo(idNo, { titulo: titulo.trim() });
        voltarParaEstrutura();
    };

    async function alternarVisivel(): Promise<void> {
        const novo = !visivel;
        await editarNo(idNo, { visivel: novo });
        setVisivel(novo);
    };

    return (
        <SPA__PaginaAdminGestaoMenu__EdicaoNo
            titulo={titulo}
            aoMudarTitulo={setTitulo}
            visivel={visivel}
            salvando={salvando}
            salvar={salvar}
            alternarVisivel={alternarVisivel}
            cancelar={voltarParaEstrutura}
        />
    );
};
