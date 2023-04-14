import DescopeClient from "@descope/node-sdk";

const sessionToken = process.argv[2];

try {
  const descopeClient = DescopeClient({
    projectId: "P2OPANdSmtackRAJlrRKFxFcoriw",
  });
  const authInfo = await descopeClient.validateSession(sessionToken);
  console.log("Successfully validated user session:");
  console.log(authInfo.token.nsec.email);
} catch (error) {
  console.error("Could not validate user session ", error);
}
