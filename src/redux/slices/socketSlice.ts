import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SocketStatus = "disabled" | "loading" | "ready" | "error";

type SocketState = { status: SocketStatus; lastError: string | null; lastChangeAt: number; };

const initialState: SocketState = { status: "disabled", lastError: null, lastChangeAt: Date.now() };

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocketStatus(state, action: PayloadAction<SocketStatus>) { state.status = action.payload; state.lastError = null; state.lastChangeAt = Date.now(); },
        setSocketError(state, action: PayloadAction<string>) { state.status = "error"; state.lastError = action.payload; state.lastChangeAt = Date.now(); },
        resetSocketState(state) { state.status = "disabled"; state.lastError = null; state.lastChangeAt = Date.now(); },
    },
});

export const { setSocketStatus, setSocketError, resetSocketState } = socketSlice.actions;
export default socketSlice.reducer;