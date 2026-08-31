import { isDbEnabled } from "@/lib/db";
import { ResumeProvider } from "@/features/resume";
import { ResumeAppContent } from "@/features/resume/components";

export default function Home() {
  const dbEnabled = isDbEnabled();

  return (
    <ResumeProvider isDbEnabled={dbEnabled}>
      <ResumeAppContent />
    </ResumeProvider>
  );
}
