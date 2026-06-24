import { Componente_ConteudoPrototipo } from "./conteudo";

export default function PagePrototipo() {
    return (
        <>
            <h1>Essa página deve Testar a funcionalidade de Página com música controlada por um Usuário</h1>
            <h2>Quando entrar aqui, o controlador de audio já deve transmitir a linha de áudio sendo controlada pelo Usuário</h2>
            <h3>Essa Página é a Page 2 dessa funcionalidade, q deve ter um controlador diferente da Page 1, com seu próprio Usuário Responsável</h3>
            <Componente_ConteudoPrototipo />
        </>
    );
};
