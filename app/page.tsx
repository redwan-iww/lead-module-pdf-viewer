export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Zoho CRM PDF Viewer</h1>
      <p className="text-gray-600">
        Use the path parameter to view PDFs for a specific Lead:
      </p>
      <code className="bg-gray-100 px-3 py-2 rounded block mt-2">
        /lead/{'{recordId}'}
      </code>
    </main>
  );
}