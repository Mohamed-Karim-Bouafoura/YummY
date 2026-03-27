import { Suspense } from "react"; // 1. Add this import
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="flex justify-between p-4 border-b">
            <div>🍕 Yumm-y</div>
            
            {/* 2. Wrap the Auth components in Suspense */}
            <Suspense fallback={<div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />}>
              <div className="flex gap-4">
                <Show when="signed-out">
                  <SignInButton mode="modal" />
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </Suspense>
            
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}