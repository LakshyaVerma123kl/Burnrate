import { SpendForm } from "@/components/SpendForm";

export default function AuditPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-4">Let's audit your stack.</h1>
        <p className="text-zinc-400">
          Tell us what you're paying for. We'll run the numbers against our database of optimal pricing tiers and instantly surface savings.
        </p>
      </div>
      
      <SpendForm />
    </div>
  );
}
