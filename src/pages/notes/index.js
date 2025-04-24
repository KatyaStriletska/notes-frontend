// notes-frontend/pages/notes/index.js
import Link from "next/link";

export default function NotesListPage({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div>
        <h1>All Notes (SSG)</h1>
        <p>No notes found. Maybe the API is down or has no data?</p>
        <Link href="/">Go Home</Link>
      </div>
    );
  }
  console.log(notes);

  return (
    <div>
      <h1>All Notes (SSG)</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`}>
              {note.title ||
                note.content?.substring(0, 30) ||
                `Note ${note.id}`}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/">Go Home</Link>
    </div>
  );
}

export async function getStaticProps() {
  console.log("[Frontend Build] Fetching list of notes from API...");
  try {
    const res = await fetch("http://localhost:3000/notes");
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    const notesData = await res.json();
    const notes = Array.isArray(notesData?.items) ? notesData.items : [];

    return { props: { notes } };
  } catch (error) {
    console.error("[Frontend Build] Failed to fetch notes:", error.message);
    return { props: { notes: [] } };
  }
}
