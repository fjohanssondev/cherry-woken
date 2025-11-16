import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx("container mx-auto px-4", className)}>{children}</div>
  );
}

export { Container };
