import React from 'react';

// Glassmorphism Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

// Styled Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "px-6 py-2 rounded-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-transparent hover:bg-white/5 text-gray-300"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Styled Input
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
    {...props}
  />
);

// Badge
export const Badge = ({ text, colorClass, bgClass }: { text: string; colorClass: string; bgClass: string }) => (
  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${colorClass} ${bgClass} border border-white/5`}>
    {text}
  </span>
);