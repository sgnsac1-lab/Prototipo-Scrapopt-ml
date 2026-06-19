import Sidebar from "@/src/components/layouts/Sidebar"
import { getSessionUser } from "@/src/actions/session.actions";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuario = await getSessionUser()

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar usuario={usuario!} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
