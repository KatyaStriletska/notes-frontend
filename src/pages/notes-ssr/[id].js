import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";

const formatDate = (dateString) => {};

export default function NoteSsrDetailPage({ note }) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!note) {
    return (
      <div className="text-center text-red-500 p-10">
        <Head>
          <title>Note Not Found</title>
        </Head>
        Note not found. It might have been deleted or the ID is incorrect.
        <Link
          href="/notes-ssr"
          className="block mt-4 text-blue-500 hover:underline"
        >
          Back to SSR list
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
      setIsDeleting(true);
      setDeleteError("");
      const apiUrl = `http://localhost:3001/notes/${note.id}`;
      try {
        const res = await fetch(apiUrl, { method: "DELETE" });
        if (!res.ok) {
          let errorMsg = `Failed to delete note (status: ${res.status})`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        console.log("Note deleted successfully!");
        router.push("/notes-ssr");
      } catch (error) {
        console.error("Error deleting note:", error);
        setDeleteError(
          error.message || "An unknown error occurred while deleting."
        );
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{`${note.title || `Note ${note.id}`} (SSR) - Notes App`}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-8">
        {" "}
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {deleteError && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md"
              role="alert"
            >
              {deleteError}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800 break-words">
            {note.title}{" "}
            <span className="text-sm text-purple-600 align-middle">
              (SSR Version)
            </span>
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
            <Link
              href={`/notes/edit/${note.id}?origin=ssr`}
              className={`w-full sm:w-auto text-center bg-yellow-500 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-yellow-600 transition duration-150 ease-in-out ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-disabled={isDeleting}
            >
              Edit Note
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-red-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Note"}
            </button>
          </div>

          <Link
            href="/notes-ssr"
            className={`inline-block text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150 ease-in-out ${
              isDeleting ? "opacity-50 pointer-events-none" : ""
            }`}
            aria-disabled={isDeleting}
          >
            &larr; Back to SSR Notes List
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const apiUrl = `http://localhost:3001/notes/${id}`;

  console.log(`[SSR] Fetching note data for details ID: ${id}...`);

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error(`[SSR] Failed to fetch note ${id}. Status: ${res.status}`);
      return { notFound: true };
    }
    const note = await res.json();
    return { props: { note } };
  } catch (error) {
    console.error(`[SSR] Error fetching note ${id}:`, error);
    return { notFound: true };
  }
}
