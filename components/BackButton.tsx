import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className = "" }: BackButtonProps) {
  return (
    <div className={`back-button-container ${className}`}>
      <Link href={href} className="back-button">
        <ChevronLeft className="back-button-icon text-foreground" />
        <span className="back-button-text text-foreground">Back</span>
      </Link>
    </div>
  );
} 