import DescopeClient from "@descope/node-sdk";
import { importJWK } from "jose";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";

const sessionToken = process.argv[2];
const projectId = "P2OPANdSmtackRAJlrRKFxFcoriw";
try {
  const descopeClient = DescopeClient({
    projectId,
  });

  // fetch public key
  const jwks = await (
    await fetch(`https://api.descope.com/v2/keys/${projectId}`)
  ).json();
  const publicKey = await importJWK(jwks.keys[0]);

  // verify session token signature
  await promisify(jwt.verify)(sessionToken, publicKey, {
    algorithms: ["RS256"],
  });

  // validate session token
  const authInfo = await descopeClient.validateSession(sessionToken);
  console.log("Successfully validated user session:");
  console.log(authInfo.token.nsec.email);
} catch (error) {
  console.error("Could not validate user session ", error);
}
