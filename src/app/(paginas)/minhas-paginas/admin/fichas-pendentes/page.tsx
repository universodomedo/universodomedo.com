import { PaginaPendenciasFichaComDados } from './componentes.tsx';
import { ContextoPaginaFichasPendentesProvider } from './contexto.tsx';

export default async function PaginaPendenciasFicha() {
    return (
        <ContextoPaginaFichasPendentesProvider>
            <PaginaPendenciasFichaComDados/>
        </ContextoPaginaFichasPendentesProvider>
    );
}

// Procedimento de Personagem

// Passo 1
// Enviar um convite para o jogador

// Passo 2
// O jogador aceita o convite
// São criados os registros de Personagem e InformacaoPersonagem (nome e anoNascimento)
// O Personagem está em pendencia de Resumo de Aventura (pendencia do usuario)
// O Personagem está em pendencia de Configuração de Ficha (pendencia do admin)
// -> Essa configuração cuida tmb de estudos e qualquer outra mecanica de inicio do personagem
// O Personagem está em pendencia de Avatar (pendencia do admin)

// Passo 3
// O Jogador atualiza seu Resumo da Aventura
// O Admin configura a ficha zerada (entidade de nivel null)
// O Admin vincula a Imagem de Avatar
// O Personagem está em pendencia de Ficha não criada

// Passo 4
// O Jogador atualiza a Ficha para o Nex Inicial
// O Personagem está Sem Pendencias


// Passo Futuro 1
// O Personagem sobe de Nex
// O Personagem está em pendencia de Ficha Desatualizada

// Passo Futuro 2
// O Jogador atualiza a Ficha para o Nex Atual
// O Personagem está Sem Pendencias