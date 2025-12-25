"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
// import ReduxProvider from "@/components/ReduxProvider";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideHeader = pathname === "/login" || pathname === "/signup";
    return (
        <>
            {!hideHeader && <Header />}
            {/* <ReduxProvider> */}
                {children}
            {/* </ReduxProvider> */}
        </>
    );
}
