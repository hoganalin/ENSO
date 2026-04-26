import FrontendShell from "./frontend-shell";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <FrontendShell>{children}</FrontendShell>;
}

