import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="fixed top-0 z-40 flex w-full shadow dark:border-b bg-background">
      <nav className="flex items-center justify-between w-full max-w-md p-8 mx-auto sm:px-0">
        <a href="#" title="IIElevenLabs">
          <Logo />
        </a>
        <ModeToggle />
      </nav>
    </header>
  );
}
