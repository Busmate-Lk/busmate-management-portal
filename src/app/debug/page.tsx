'use server';

import { asgardeo } from "@asgardeo/nextjs/server";

export default async function page() {
  const client = await asgardeo();
  const sessionId = await client.getSessionId();
  const accessToken = sessionId ? await client.getAccessToken(sessionId) : undefined;

  console.log('Client:', client);
  console.log('Session ID:', sessionId);

  return (
    <>
      <div>page</div>
      {/* <div>Client: {client}</div> */}
      <div>Session ID: {sessionId}</div>
      <div>Access Token: {accessToken}</div>


    </>
  )
}

