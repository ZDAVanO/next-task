"use client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { increment, decrement } from "@/lib/store";

export default function Counter() {
    const value = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => dispatch(decrement())}>-</button>
            <span style={{ minWidth: 32, textAlign: "center" }}>{value}</span>
            <button onClick={() => dispatch(increment())}>+</button>
        </div>
    );
}