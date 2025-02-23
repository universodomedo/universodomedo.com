import useApi from "Uteis/ApiConsumer/Consumer.tsx";

export class Atributo {
    constructor(
        public id: number,
        public nome: string,
        public descricao: string,
    ) { }

    get nomeAbreviado(): string { return this.nome.toUpperCase().slice(0, 3); }
}

type ApiResponse = { sucesso: true; dados: Atributo[] } | { sucesso: false; erro: string };

class CustomApiCall {
    public async obterAtributos(): Promise<ApiResponse> {
        try {
            const atributosData = await useApi<Atributo[]>('/atributos');
            const atributos = atributosData.map(data => new Atributo(data.id, data.nome, data.descricao));
            return { sucesso: true, dados: atributos };
        } catch (error) {
            // console.error("Erro ao obter atributos:", error);
            return { sucesso: false, erro: "Erro ao carregar os dados da API. Tente novamente mais tarde." };
        }
    }
}

export default CustomApiCall;