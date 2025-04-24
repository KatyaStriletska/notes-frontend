import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

export default function NoteDetailPage({ note }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading note...
      </div>
    );
  }

  if (!note) {
    return <div className="text-center text-red-500 p-10">Note not found.</div>;
  }

  const handleEdit = () => {
    alert("Edit functionality not implemented yet.");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      alert("Delete functionality not implemented yet.");
    }
  };

  return (
    <>
      <Head>
        <title>{note.title || `Note ${note.id}`} - Notes App</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800 break-words">
            {note.title}
          </h1>

          <div className="text-xs text-gray-500 mb-6 space-x-3">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.createdAt !== note.updatedAt && (
              <span>| Updated: {formatDate(note.updatedAt)}</span>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap text-gray-700 mb-8 text-base leading-relaxed">
            {note.content || "..."}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto bg-yellow-500 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-yellow-600 transition duration-150 ease-in-out"
            >
              Edit Note
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-red-700 transition duration-150 ease-in-out"
            >
              Delete Note
            </button>
          </div>

          <Link
            href="/notes"
            className="inline-block text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out"
          >
            &larr; Back to Notes List
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  console.log("[Frontend Build] Fetching note IDs for paths...");
  const apiUrl = "http://localhost:3000/notes";
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const notesData = await res.json();
    const notes = Array.isArray(notesData?.items) ? notesData.items : [];

    const paths = notes.map((note) => ({
      params: { id: note.id.toString() },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error(
      "[Frontend Build] Failed to fetch note IDs for paths:",
      error.message
    );
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps(context) {
  const id = context.params.id;
  console.log(`[Frontend Build] Fetching note data for ID: ${id}...`);
  const apiUrl = `http://localhost:3000/notes/${id}`;
  try {
    const res = await fetch(apiUrl);

    if (!res.ok && res.status === 404) {
      return { notFound: true };
    }
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const note = await res.json();
    return { props: { note } };
  } catch (error) {
    console.error(
      `[Frontend Build] Failed to fetch note ${id}:`,
      error.message
    );
    return { notFound: true };
  }
}
