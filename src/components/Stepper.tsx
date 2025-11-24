import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ currentStep, totalSteps, stepLabels, className, onStepClick }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between mb-8", className)}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              step <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
              onStepClick && "cursor-pointer hover:opacity-80"
            )}
            onClick={() => onStepClick?.(step)}
            role={onStepClick ? "button" : undefined}
            tabIndex={onStepClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStepClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onStepClick(step);
              }
            }}
          >
            {step}
          </div>

          {stepLabels && stepLabels[step - 1] && (
            <div className="ml-2 text-sm font-medium">
              {stepLabels[step - 1]}
            </div>
          )}

          {step < totalSteps && (
            <div
              className={cn(
                "w-16 h-1 mx-2 transition-colors",
                step < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}