"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginTop: '8px', marginBottom: '16px' }}>
          <button onClick={() => signOut()}>Вийти</button>
        </div>

        <pre >
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <p>Ви не увійшли в систему</p>
      <button onClick={() => signIn("google")}>Увійти через Google</button>
    </div>
  )
}