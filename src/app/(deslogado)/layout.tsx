export default function LayoutDeslogado({ children }: { children: React.ReactNode }) {
    console.log('entrando em uma pagina que não precisa de auth');
    
    return (
        <>
            {children}
        </>
    );
};