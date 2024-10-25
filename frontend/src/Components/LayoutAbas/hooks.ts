// #region Imports
import { createContext, useContext } from "react";
// #endregion

export const LoadingContext = createContext<{ loading: boolean; stopLoading: () => void } | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading deve ser usado dentro de um LoadingProvider");
    return context;
};