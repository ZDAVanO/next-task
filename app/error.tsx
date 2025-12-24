'use client';

export default function Error() {
    return (
        <main className="container mx-auto p-4 error">
            <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
            <p className="text-red-600">Unable to load tasks due to a database error. Please try again later.</p>
        </main>
    );
}


