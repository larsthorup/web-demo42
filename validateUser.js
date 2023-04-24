import DescopeClient from "@descope/node-sdk";
import { importJWK } from "jose";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";

const sessionToken = process.argv[2];
const projectId = "P2OPANdSmtackRAJlrRKFxFcoriw";
try {
  const descopeClient = DescopeClient({ projectId });

  // fetch public key in JWKS format (JSON Web Key Set)
  const jwksUrl = `https://api.descope.com/v2/keys/${projectId}`;
  const jwksResponse = await fetch(jwksUrl);
  const jwks = await jwksResponse.json();
  const jwk = jwks.keys[0];
  const publicKey = await importJWK(jwk);

  // verify signature of session token
  // proving that the token was signed by the private key of our Descope project
  const verify = promisify(jwt.verify);
  const algorithms = ["RS256"];
  await verify(sessionToken, publicKey, { algorithms });

  // validate session token
  const authInfo = await descopeClient.validateSession(sessionToken);
  console.log("Successfully validated user session:");
  console.log(authInfo.token.nsec.email);
} catch (error) {
  console.error("Could not validate user session ", error);
}
