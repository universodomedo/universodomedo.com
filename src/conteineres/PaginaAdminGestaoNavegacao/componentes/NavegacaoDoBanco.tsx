'use client';

import { useEffect, useState } from 'react';

import { obtemNavegacaoDoBanco, type MenuDoBancoDto, type MenuNoDoBancoDto } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default function NavegacaoDoBanco() {
    const [navegacao, setNavegacao] = useState<MenuDoBancoDto[] | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        obtemNavegacaoDoBanco().then(setNavegacao).catch(capturado => setErro(capturado instanceof Error ? capturado.message : 'Erro ao montar a navegação do banco.'));
    }, []);

    if (erro) return <div>Erro ao montar a navegação do banco: {erro}</div>;
    if (navegacao === null) return <div>Montando navegação a partir do banco…</div>;
    if (navegacao.length < 1) return <div>Nenhum menu no banco ainda — insira em site.menus.</div>;

    return (
        <div>
            <h3>Navegação montada do banco (site.menus + site.menus_nos)</h3>
            {navegacao.map(menu => (
                <div key={menu.id}>
                    <strong>{menu.chave}</strong> ({menu.tipo})
                    {menu.nos.length < 1 ? <div>— sem itens; insira em site.menus_nos com fk__menus__id = {menu.id} —</div> : <ArvoreNos nos={menu.nos} />}
                </div>
            ))}
        </div>
    );
};

function ArvoreNos({ nos }: { nos: MenuNoDoBancoDto[] }) {
    return (
        <ul>
            {nos.map(no => (
                <li key={no.id}>
                    {no.titulo}{no.tipo === 'item' && no.paginaTemplate ? ` → ${no.paginaTemplate}` : ''}{!no.visivel ? ' (oculto)' : ''}
                    {no.filhos.length > 0 && <ArvoreNos nos={no.filhos} />}
                </li>
            ))}
        </ul>
    );
};
