import pkceChallenge from "pkce-challenge";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const CLIENT_ID = process.env.TURSO_CLIENT_ID!;
const REDIRECT_URI = process.env.TURSO_REDIRECT_URI!;

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { access_token } = searchParams;

  async function handleSubmit() {
    "use server";

    const { code_challenge: CODE_CHALLENGE, code_verifier } =
      await pkceChallenge();

    cookies().set("code_verifier", code_verifier, { secure: true });

    const url = `https://turso.tech/integrations/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&code_challenge_method=S256&code_challenge=${CODE_CHALLENGE}`;

    redirect(url);
  }

  return (
    <div className="h-screen flex items-center justify-center">
      {access_token ? (
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold">You did it! 🎉</h1>
          <p>
            You successfully authorized this with Turso. You will need to
            implement your own auth to persist sessions, and store the user
            access_token:
          </p>
          <pre>{access_token}</pre>
        </div>
      ) : (
        <form action={handleSubmit}>
          <button
            type="submit"
            className="bg-teal-500 text-white rounded px-3 py-1.5 hover:bg-teal-600"
          >
            Connect Turso
          </button>
        </form>
      )}
    </div>
  );
}
