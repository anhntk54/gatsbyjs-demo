import VisitorCounter from "./components/VisitorCounter";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-sm px-6">
        <VisitorCounter />
      </div>
    </div>
  );
}
