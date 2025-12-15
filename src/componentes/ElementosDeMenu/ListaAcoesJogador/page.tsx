import { NivelPermissao, RenderItensPermissoes } from '../componentes';

export default function ListaAcoesJogador() {
    const permissoesJogador: NivelPermissao[] = [
        {
            tituloPermissao: 'Jogador',
            condicao: true,
            itens: [
                { titulo: 'Início', link: '' },
                { titulo: 'Meus Personagens', link: 'meus-personagens' },
            ],
        },
    ];

    return RenderItensPermissoes(permissoesJogador, 'jogador', false, '/minhas-paginas');
};