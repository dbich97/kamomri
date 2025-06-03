import AgeCalculator from '@/components/age-calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <AgeCalculator />
    </main>
  );
}
