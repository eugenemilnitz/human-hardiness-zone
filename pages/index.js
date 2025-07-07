
import dynamic from "next/dynamic";

const HumanHardinessQuiz = dynamic(() => import("../components/HumanHardinessQuiz"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <HumanHardinessQuiz />
    </main>
  );
}
