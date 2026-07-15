import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { StepIndicator } from '@/components/form/StepIndicator';
import { Scene } from '@/components/3d/Scene';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-nightBackground text-textPrimary font-sans">
      {/* 3D Background Scene - Fixed position, full screen */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-deepMuseBlue/80 to-nightBackground/80 pointer-events-none" />
      
      {/* Content - Above 3D scene */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-4 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-brushedBrass">
              Möbius Muse
            </h1>
            <p className="text-textMuted text-sm">
              Blueprint Data Intake System
            </p>
          </div>
        </header>
        
        {/* Step Indicator */}
        <StepIndicator />
        
        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
