import { useCallback } from "react";

type UseLogoutArgs = {
    obtemObjetoAutenticacao: () => Promise<unknown>;
    desconectar: () => void | Promise<void>;
};

export default function useLogout({ obtemObjetoAutenticacao, desconectar }: UseLogoutArgs) {
    const logout = useCallback(async () => {
        await obtemObjetoAutenticacao();
        await Promise.resolve(desconectar());
        window.location.href = "/";
    }, [obtemObjetoAutenticacao, desconectar]);

    return { logout };
};