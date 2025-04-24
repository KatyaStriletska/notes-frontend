import Link from "next/link";
import Head from "next/head";

export default function NotesSsrListPage({ notes }) {
  return (
    <>
      <Head>
        <title>All Notes (SSR) - Notes App</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-8">
        {" "}
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
            My Notes <span className="text-purple-600">(SSR Version)</span>
          </h1>

          {!notes || notes.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No notes found. Maybe the API is down or has no data?</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="border border-gray-200 rounded-lg transition duration-200 ease-in-out hover:shadow-md hover:border-purple-300"
                >
                  {" "}
                  <Link href={`/notes-ssr/${note.id}`} className="block p-4">
                    <h2 className="text-xl font-semibold text-purple-700 hover:text-purple-900 mb-1 truncate">
                      {note.title || `Note ${note.id}`}
                    </h2>
                    <p className="text-gray-600 text-sm truncate">
                      {note.content?.substring(0, 100) || "No content preview"}
                      {note.content && note.content.length > 100 ? "..." : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-indigo-700 transition duration-150 ease-in-out"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  console.log("[SSR] Fetching list of notes from API...");
  const apiUrl = "http://localhost:3001/notes";
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    const notesData = await res.json();
    const notes = Array.isArray(notesData?.items) ? notesData.items : [];

    return { props: { notes } };
  } catch (error) {
    console.error("[SSR] Failed to fetch notes:", error.message);
    return { props: { notes: [] } };
  }
}
