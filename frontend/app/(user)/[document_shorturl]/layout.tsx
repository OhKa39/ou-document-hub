export default function Layout({
  children,
  document_additional,
}: {
  children: React.ReactNode;
  document_additional: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-[1536px] px-12 pb-8 md:px-8 lg:px-32 2xl:mx-auto">
      {children}
      {document_additional}
    </div>
  );
}
