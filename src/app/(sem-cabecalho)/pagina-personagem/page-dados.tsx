import { PersonagemDto } from "types-nora-api";

export default function PaginaPersonagemComDados({ dadosPersonagem }: { dadosPersonagem: PersonagemDto }) {
    return (
        <><h1>ID [{dadosPersonagem.id}]</h1></>
    );
};