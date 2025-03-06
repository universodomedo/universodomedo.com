'use client';

import styles from "./styles.module.css";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PaginaUsuario() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/acessar');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (status === 'authenticated') {
        return (
            <>
                <h1>Bem-vindo, {session.user!.name}</h1>
            </>
        );
    }

    return null;
}