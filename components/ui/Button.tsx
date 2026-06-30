import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'solid' | 'outline';
}

export default function Button({ children, href = '#', variant = 'solid' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200';
  const styles =
    variant === 'outline'
      ? 'border border-white/80 bg-transparent text-white hover:bg-white/10'
      : 'bg-red-500 text-white hover:bg-red-600';

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
