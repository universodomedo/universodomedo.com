import { useEffect, useState } from "react";

export function useRequisicao<T>(callback: () => Promise<T>, deps: any[] = []) {
    const [dados, setDados] = useState<T | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<Error | null>(null);

    const carregar = () => {
        setCarregando(true);
        setErro(null);

        return callback()
            .then(setDados)
            .catch(setErro)
            .finally(() => setCarregando(false));
    };

    useEffect(() => {
        let ativo = true;
        carregar().then(() => {
            if (!ativo) return;
        });
        return () => {
            ativo = false;
        };
    }, deps);

    return { dados, carregando, erro, recarregar: carregar };
}