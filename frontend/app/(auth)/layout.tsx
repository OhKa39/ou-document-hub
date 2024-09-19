export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="max-w-[1544px] 2xl:mx-auto">{children}</main>
}