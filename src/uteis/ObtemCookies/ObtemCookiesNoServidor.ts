"use server";

import { cookies } from "next/headers";

export async function obtemCookiesNoServidor() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}