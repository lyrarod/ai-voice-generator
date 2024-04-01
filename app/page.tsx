import { GenerateForm } from "@/components/generate-form";

export default async function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <GenerateForm />
    </section>
  );
}
