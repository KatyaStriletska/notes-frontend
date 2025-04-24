import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function EditNotePage({ note }) {
  const router = useRouter();
  const noteId = note?.id;

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!noteId) {
      setError("Note ID is missing. Cannot update.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `http://localhost:3000/notes/${noteId}`;

    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        let errorMsg = `Failed to update note (status: ${res.status})`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {}
        throw new Error(errorMsg);
      }

      router.push(`/notes/${noteId}`);
    } catch (err) {
      console.error("Error updating note:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Head>
          <title>Error Loading Note</title>
        </Head>
        <p className="text-red-600">Could not load note data for editing.</p>
        <Link href="/notes" className="ml-4 text-blue-500 hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit: {note.title}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
            Edit Note
          </h1>

          {error && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mt-6">
              <Link
                href={`/notes/${noteId}`}
                className={`text-gray-600 hover:text-gray-800 text-sm sm:order-1 ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto order-first sm:order-2 bg-green-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-green-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const apiUrl = `http://localhost:3000/notes/${id}`;

  console.log(`[SSR] Fetching note data for editing ID: ${id}...`);

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      console.error(`[SSR] Failed to fetch note ${id}. Status: ${res.status}`);
      return { notFound: true };
    }

    const note = await res.json();

    return { props: { note } };
  } catch (error) {
    console.error(`[SSR] Error fetching note ${id} for editing:`, error);
    return { notFound: true };
  }
}
