import Link from "next/link";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Notes App Home</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-cyan-100 p-4 text-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Notes App Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose a rendering strategy to view notes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-blue-200 p-6 rounded-lg bg-blue-50">
              <h2 className="text-2xl font-semibold mb-3 text-blue-800">SSG</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pages generated at build time. Fast initial load, might need
                revalidation for updates.
              </p>
              <Link
                href="/notes"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                View SSG Notes
              </Link>
            </div>

            <div className="border border-purple-200 p-6 rounded-lg bg-purple-50">
              <h2 className="text-2xl font-semibold mb-3 text-purple-800">
                SSR
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Pages generated on every request. Always shows the latest data,
                slightly slower initial load.
              </p>
              <Link
                href="/notes-ssr"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md font-medium shadow-sm hover:bg-purple-700 transition duration-150 ease-in-out"
              >
                View SSR Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
