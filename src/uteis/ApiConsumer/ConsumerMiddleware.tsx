import useApi from "Uteis/ApiConsumer/Consumer.tsx";

export class Atributo {
    constructor(
        public id: number,
        public nome: string,
        public descricao: string,
    ) { }

    get nomeAbreviado(): string { return this.nome.toUpperCase().slice(0, 3); }
}

export class Pericia {
    constructor(
        public id: number,
        public idAtributo: number,
        public idLinhaEfeito: number,
        public nome: string,
        public descricao: string,
    ) { }

    get nomeAbreviado(): string { return this.nome.toUpperCase().slice(0, 4); }
}

type ApiResponse<T> = { sucesso: true; dados: T } | { sucesso: false; erro: string };

class CustomApiCall {
    public async obterAtributos(): Promise<ApiResponse<Atributo[]>> {
        try {
            // const atributosData = await useApi<Atributo[]>('/atributos');
            // const atributos = atributosData.map(data => new Atributo(data.id, data.nome, data.descricao));
            const atributos = [
                new Atributo(1, 'Agilidade', 'Índice da velocidade e precisão que seu corpo responde a estímulos'),
                new Atributo(2, 'Força', 'Índice da construção física de seu corpo'),
                new Atributo(3, 'Inteligência', 'Índice da sua capacidade mental, que responde à atividades intelectuais e memórias'),
                new Atributo(4, 'Presença', 'Índice de seus sentidos e habilidades sociais'),
                new Atributo(5, 'Vigor', 'Índice da sua resistência física e persistência'),
            ];
            return { sucesso: true, dados: atributos };
        } catch (error) {
            // console.error("Erro ao obter atributos:", error);
            return { sucesso: false, erro: "Erro ao carregar os dados da API. Tente novamente mais tarde." };
        }
    }

    public async obterPericias(): Promise<ApiResponse<Pericia[]>> {
        try {
            // const periciasData = await useApi<Pericia[]>('/pericias');
            // const pericias = periciasData.map(data => new Pericia(data.id, data.idAtributo, data.idLinhaEfeito, data.nome, data.descricao));
            const pericias = [
                new Pericia(1, 1, 6, 'Acrobacia', 'Experiência em movimentação vertical e manobras, como realizar movimentos não lineares ou em maior velocidade'),
                new Pericia(2, 1, 12, 'Crime', 'Experiência no roubo e encobrimento de objetos, assim como a resolução e manuseio de pequenos mecanismos'),
                new Pericia(3, 1, 17, 'Furtividade', 'Experiência em se esconder e tomar ações estando despercebido, assim como atacar furtivamente e se mesclar no ambiente'),
                new Pericia(4, 1, 18, 'Iniciativa', 'Experiência em tomar ações de maneira preventiva, se preparando para situações especificas ou reagindo a ações tomadas por outros'),
                new Pericia(5, 1, 26, 'Pontaria', 'Experiência no manuseio de armas de longo alcance e suas utilizações'),
                new Pericia(6, 1, 27, 'Reflexo', 'Experiência em reagir defensivamente a situações inesperadas'),
                new Pericia(7, 2, 9, 'Atletismo', 'Experiência em utilizar o máximo de sua capacidade física'),
                new Pericia(8, 2, 22, 'Luta', 'Experiência no manuseio de armas corpo-a-corpo e suas utlizações'),
                new Pericia(9, 3, 7, 'Adestramento', 'Experiência na domesticação, treinamento e relacionamento com seres domesticáveis'),
                new Pericia(10, 3, 8, 'Artes', 'Experiência na execução de ações magistrais, que procuram chamar atenção do público'),
                new Pericia(11, 3, 10, 'Atualidades', 'Experiência no estudo de acontecimentos do mundo e como eles se afetam'),
                new Pericia(12, 3, 11, 'Ciências', 'Experiência no estudo de matérias biológicas e lógicas, utilizadas na confecção e produção de substâncias'),
                new Pericia(13, 3, 15, 'Engenharia', 'Experiência na produção de ferramentas, equipamentos e utensílios'),
                new Pericia(14, 3, 21, 'Investigação', 'Experiência na busca de detalhes e atenção a pistas no ambiente ou em objetos'),
                new Pericia(15, 3, 23, 'Medicina', 'Experiência no tratamento de ferimentos, condições negativas e suas adversidades em materiais biológicos'),
                new Pericia(16, 3, 24, 'Ocultismo', 'Experiência em estudar e se comunicar com o outro lado'),
                new Pericia(17, 3, 28, 'Sobrevivência', 'Experiência em utilizar de materiais naturais para sobreviver ou se adaptar à ambientes inóspitos e vida selvagem'),
                new Pericia(18, 3, 29, 'Tatica', 'Experiência em estudar e analisar o ambiente e seus alvos para melhor explorá-los'),
                new Pericia(19, 3, 30, 'Tecnologia', 'Experiência na utilizaçao de equipamentos tecnológicos e seus conhecimentos'),
                new Pericia(20, 4, 13, 'Diplomacia', 'Experiência na comunicação com outros seres racionais e suas vantagens'),
                new Pericia(21, 4, 14, 'Enganação', 'Experiência em esconder ou mentir informações e trabalhar com disfarces'),
                new Pericia(22, 4, 19, 'Intimidação', 'Experiência em coagir oui amendrontar seus alvos'),
                new Pericia(23, 4, 20, 'Intuição', 'Experiência na analise da omissão de informações de outros seres racionais'),
                new Pericia(24, 4, 25, 'Percepção', 'Experiência em observar, analisar e estudar seus arredores, como padrões ou alterações no ambiente'),
                new Pericia(25, 4, 31, 'Vontade', 'Experiência em resistir a condições e danos mentais'),
                new Pericia(26, 5, 16, 'Fortitude', 'Experiência em resistir a condições e danos físicos, assim como danos graves'),
            ]
            return { sucesso: true, dados: pericias };
        } catch (error) {
            // console.error("Erro ao obter perícias:", error);
            return { sucesso: false, erro: "Erro ao carregar os dados da API. Tente novamente mais tarde." };
        }
    }
}

export default CustomApiCall;