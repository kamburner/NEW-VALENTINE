import React from 'react';

export const FloatingHearts: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Static cute background elements to avoid heavy JS animation overhead */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>❤️</div>
      <div className="absolute top-1/4 right-20 text-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💖</div>
      <div className="absolute bottom-20 left-1/3 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>💘</div>
      <div className="absolute top-1/2 left-10 text-2xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>💕</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-float" style={{ animationDelay: '4s' }}>💓</div>
    </div>
  );
};
