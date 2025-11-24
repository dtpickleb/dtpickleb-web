import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Stepper from "@/components/Stepper";
import { ArrowLeft } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: ReactNode;
  content: ReactNode;
}

interface MultiStepFormProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  stepLabels?: string[];
  submitButtonText?: string;
  showStepCard?: boolean;
  disableNext?: boolean;
  onStepClick?: (step: number) => void;
}

export default function MultiStepForm({
  currentStep,
  totalSteps,
  steps,
  onNext,
  onBack,
  onSubmit: _onSubmit,
  isSubmitting = false,
  stepLabels,
  submitButtonText = "Submit",
  showStepCard = true,
  disableNext = false,
  onStepClick,
}: MultiStepFormProps) {
  void _onSubmit;
  const currentStepData = steps[currentStep - 1];

  const content = (
    <>
      <Stepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        onStepClick={onStepClick}
      />

      {showStepCard ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStepData?.icon}
              {currentStepData?.title}
            </CardTitle>
            <CardDescription>
              {currentStepData?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData?.content}
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-6">
            {currentStepData?.icon}
            <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
          </div>
          <p className="text-muted-foreground mb-6">{currentStepData?.description}</p>
          {currentStepData?.content}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNext();
            }}
            disabled={disableNext}
          >
            Next
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </div>
    </>
  );

  return content;
}