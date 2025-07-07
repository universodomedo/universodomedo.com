export default function combineProviders(...providers: React.FC<ProviderProps>[]) {
    return ({ children }: ProviderProps) =>
        providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
};

type ProviderProps = {
    children: React.ReactNode;
};