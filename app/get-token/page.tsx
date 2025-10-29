"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GetTokenPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      // Get the full session data
      fetch("/api/get-refresh-token").then(async (res) => {
        const data = await res.json();
        if (data.refreshToken) {
          setToken(data.refreshToken);
        }
      });
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Get Your Spotify Refresh Token</h1>
        
        {!session ? (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Connect Your Spotify Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Click the button below to authenticate with Spotify. This is a one-time setup.
              </p>
              <Button onClick={() => signIn("spotify")} size="lg">
                Connect Spotify
              </Button>
            </CardContent>
          </Card>
        ) : token ? (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">✅ Success! Your Refresh Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded font-mono text-sm break-all">
                {token}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Copy the token above</li>
                  <li>Open your <code className="bg-muted px-2 py-1 rounded">.env.local</code> file</li>
                  <li>Add this line: <code className="bg-muted px-2 py-1 rounded">SPOTIFY_REFRESH_TOKEN=your_token_here</code></li>
                  <li>Restart your dev server (Ctrl+C and run <code className="bg-muted px-2 py-1 rounded">npm run dev -- --turbopack</code>)</li>
                  <li>Delete or comment out this page file: <code className="bg-muted px-2 py-1 rounded">app/get-token/page.tsx</code></li>
                </ol>
              </div>

              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  alert("Token copied to clipboard!");
                }}
                variant="outline"
              >
                Copy Token
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Loading your token...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please wait while we fetch your refresh token...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

