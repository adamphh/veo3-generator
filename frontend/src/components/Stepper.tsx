import React from 'react';
import { Check, Sparkles, Video, FileText, Download } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Nhập Sản Phẩm', icon: Sparkles },
  { id: 2, name: '10 Kịch Bản & AI SEO', icon: FileText },
  { id: 3, name: 'Render Video Veo 3', icon: Video },
  { id: 4, name: 'Xuất Bản & Tải Về', icon: Download },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                      : isCurrent
                      ? 'bg-shopee-orange border-shopee-orange text-white shadow-lg ring-4 ring-orange-100'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium ${
                    isCurrent ? 'text-shopee-orange font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
