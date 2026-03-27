import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <header className="flex justify-between items-center p-4 border-b bg-white">
            <div className="font-bold text-xl text-orange-600">🍕 Yumm-y</div>
            <div className="flex gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg font-medium">Sign Up</button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
            </div>
          </header>
          <main>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}