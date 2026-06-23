import { Componente_ConteudoPrototipo } from './conteudo';

export default function PagePrototipo() {
    return (
        <>
            <h1>Essa página deve Testar a funcionalidade de Página que possui uma música de fundo</h1>
            <h2>Quando entrar aqui, o controlador de audio já deve colocar pra tocar a música dessa página</h2>
            <h3>Essa Página é a Page 2 dessa funcionalidade, q deve ter uma música diferente da Page 1</h3>
            <Componente_ConteudoPrototipo />
        </>
    );
};
