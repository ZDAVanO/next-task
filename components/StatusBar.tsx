// components/StatusBar.tsx
'use client'; // Обов'язково, бо Zustand працює на клієнті

import { useAppStore } from '@/lib/store';

export default function StatusBar() {
    const lastAction = useAppStore((state) => state.lastAction);

    return (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg text-sm border border-slate-700">
            Статус: <span className="text-blue-400">{lastAction}</span>
        </div>
    );
}