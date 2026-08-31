import { cookies } from "next/headers";
import { isDbEnabled } from "@/lib/db";
import { ResumeProvider } from "@/features/resume";
import { ResumeAppContent } from "@/features/resume/components";
import { authService, PasswordGate } from "@/features/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const authRequired = authService.isAuthRequired();

  if (authRequired) {
    const cookieStore = await cookies();
    const token = cookieStore.get("cv_auth_session")?.value;
    const isAuthenticated = authService.verifySessionToken(token);

    if (!isAuthenticated) {
      return <PasswordGate />;
    }
  }

  const dbEnabled = isDbEnabled();

  return (
    <ResumeProvider isDbEnabled={dbEnabled}>
      <ResumeAppContent isAuthProtected={authRequired} />
    </ResumeProvider>
  );
}
