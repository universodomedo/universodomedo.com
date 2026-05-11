'use client';

import { useContexto__GerenciarEmblemas__Listagem } from 'Contextos/Contexto__GerenciarEmblemas__Listagem/contexto';

function formataDataEmblema(data: Date | string | null | undefined): string {
    if (!data) return '-';

    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return '-';

    return dataFormatada.toLocaleDateString('pt-BR');
};

function resolveNomeVisualEmblema(nome: string, nomeVisual: string | null): string {
    return nomeVisual?.trim() || nome;
};

function resolveTextoArquivo(caminhoArquivo: string | null): string {
    return caminhoArquivo?.trim() || '-';
};

export default function SPA__PaginaGerenciarEmblemas__Listagem() {
    // const { emblemas } = useContexto__GerenciarEmblemas__Listagem();

    // const emblemasOrdenados = [...emblemas].sort((a, b) => new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime());

    // return (
    //     <>
    //         {emblemasOrdenados.length > 0 && (
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th>#</th>
    //                         <th>ID</th>
    //                         <th>Nome</th>
    //                         <th>Nome técnico</th>
    //                         <th>Descrição</th>
    //                         <th>Data de criação</th>
    //                         <th>Moldura</th>
    //                         <th>Emblema</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {emblemasOrdenados.map((emblema, index) => (
    //                         <tr key={emblema.id}>
    //                             <td>{index + 1}</td>
    //                             <td>{emblema.id}</td>
    //                             <td>{resolveNomeVisualEmblema(emblema.nome, emblema.nomeVisual)}</td>
    //                             <td>{emblema.nome}</td>
    //                             <td>{emblema.descricao}</td>
    //                             <td>{formataDataEmblema(emblema.dataCriacao)}</td>
    //                             <td>{resolveTextoArquivo(emblema.arquivos.caminhoArquivoMoldura)}</td>
    //                             <td>{resolveTextoArquivo(emblema.arquivos.caminhoArquivoEmblema)}</td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         )}
    //     </>
    // );

    return <></>;
};