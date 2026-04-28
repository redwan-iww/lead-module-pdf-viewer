import PdfViewer from "@/components/pdf-viewer";
import { Suspense } from "react";

function Loading() {
  return <div className="text-gray-500">Loading...</div>;
}

export default function LeadPage({ params }: { params: { recordId: string } }) {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Zoho CRM PDF Viewer</h1>
      <Suspense fallback={<Loading />}>
        <PdfViewer recordId={params.recordId} />
      </Suspense>
    </main>
  );
}
