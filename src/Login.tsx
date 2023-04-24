import { SdkResponse } from "@descope/node-sdk";
import DescopeSdk from "@descope/web-js-sdk";
import { FormEvent, useEffect, useState } from "react";

type Descope = ReturnType<typeof DescopeSdk>;
const projectId = "P2OPANdSmtackRAJlrRKFxFcoriw";

interface LoginProps {
  descope: Descope;
}
export function Login({ descope }: LoginProps) {
  const token = new URLSearchParams(window.location.search).get("t");
  const [user, setUser] = useState("");
  const [requesting, setRequesting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    setRequesting(true);
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      email: HTMLInputElement;
    };
    const email = formElements.email.value;
    authenticateUser(email, descope);
  }

  useEffect(() => {
    async function login(token: string) {
      const email = await verifyToken(token, descope);
      if (email) setUser(email);
    }
    if (token) {
      login(token);
    }
  }, [token]);

  return (
    <>
      {!token && !requesting && (
        <form onSubmit={handleSubmit} name="login" aria-label="login">
          <label>
            Your email:
            <input type="email" name="email" autoFocus={true} />
          </label>
          <button type="submit">Login</button>
        </form>
      )}
      {!token && requesting && (
        <p>Click the link in the email we just sent you!</p>
      )}
      {token && !user && <p>Logging in...</p>}
      {token && user && <p>Logged in as {user}</p>}
    </>
  );
}

export function initializeDescope(): Descope | undefined {
  try {
    return DescopeSdk({ projectId });
  } catch (error) {
    console.error("Failed to initialize Descope: " + error);
  }
}

export async function authenticateUser(email: string, descope: Descope) {
  const { protocol, host, pathname, search } = window.location;
  const redirectUrl = `${protocol}//${host}${pathname}${search}`;
  // TODO: wait for signUpOrIn to take loginOptions
  // const resp = await descope.magicLink.signUpOrIn.email(email, redirectUrl);
  type LoginOptions = {
    customClaims: Record<string, any>;
  };
  const loginOptions: LoginOptions = {
    customClaims: { email },
  };
  // TODO: wait for SignIn type to be fixed
  type FixedEmailType = (
    loginId: string,
    uri: string,
    loginOptions: LoginOptions
  ) => Promise<SdkResponse<{ ok: boolean }>>;
  const resp = await (descope.magicLink.signIn.email as FixedEmailType)(
    email,
    redirectUrl,
    loginOptions
  );
  if (!resp.ok) {
    console.error("Failed to start signUpOrIn flow", { redirectUrl, resp });
  } else {
    console.log("Successfully initialized signUpOrIn flow");
  }
}

async function verifyToken(token: string, descope: Descope) {
  const resp = (await descope.magicLink.verify(token)) as {
    ok: boolean;
    data: {
      sessionJwt: string; // Note: pass this to your API, to authorize the user there
      user: { email: string };
    };
  };
  if (!resp.ok) {
    console.error("Failed to verify token", resp);
  } else {
    console.log("Successfully verified login", resp);
    console.log(resp.data.sessionJwt);
    return resp.data.user.email;
  }
}
