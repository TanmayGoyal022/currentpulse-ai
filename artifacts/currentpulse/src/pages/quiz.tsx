import { useListQuizQuestions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const { data: questions, isLoading } = useListQuizQuestions();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions?.[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (currentQuestion && index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (!questions) return;
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-4">
        <BrainCircuit className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
        <h1 className="text-2xl font-bold">No questions available</h1>
        <p className="text-muted-foreground">Check back later for new quiz questions.</p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto">
        <Card className="text-center py-10">
          <CardHeader>
            <CardTitle className="text-3xl font-serif">Quiz Completed!</CardTitle>
            <CardDescription>Your Daily Assessment Score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted/30" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                  className={percentage >= 70 ? "text-primary" : percentage >= 40 ? "text-amber-500" : "text-destructive"}
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * percentage) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute text-4xl font-bold">{percentage}%</div>
            </div>
            
            <div className="text-lg">
              You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={handleRestart} size="lg" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Daily Quiz</h1>
          <p className="text-muted-foreground mt-1">Test your knowledge on today's current affairs</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-primary">{score} / {questions.length}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-primary h-2 transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {currentQuestion && (
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">Question {currentIndex + 1} of {questions.length}</Badge>
              <Badge variant="secondary" className={
                currentQuestion.difficulty === 'hard' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30' :
                currentQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30' :
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30'
              }>
                {currentQuestion.difficulty.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-xl md:text-2xl leading-relaxed font-serif">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = index === selectedOption;
              
              let buttonClass = "w-full justify-start h-auto min-h-[3.5rem] py-3 px-4 text-left whitespace-normal border-2 text-base font-normal";
              
              if (!isAnswered) {
                buttonClass = cn(buttonClass, "hover:border-primary/50 hover:bg-muted/50");
              } else {
                if (isCorrect) {
                  buttonClass = cn(buttonClass, "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-medium");
                } else if (isSelected) {
                  buttonClass = cn(buttonClass, "border-destructive bg-destructive/10 text-destructive font-medium");
                } else {
                  buttonClass = cn(buttonClass, "opacity-50");
                }
              }

              return (
                <Button 
                  key={index} 
                  variant="outline" 
                  className={buttonClass}
                  onClick={() => handleSelectOption(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center w-full gap-3">
                    <div className="w-6 shrink-0 flex items-center justify-center font-mono font-medium text-muted-foreground bg-background rounded p-1 border">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">{option}</div>
                    {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                  </div>
                </Button>
              );
            })}

            {isAnswered && (
              <div className="mt-6 p-5 bg-muted/50 rounded-lg border animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold flex items-center gap-2 mb-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Explanation
                </h4>
                <p className="text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end pt-2 pb-6 px-6">
            <Button 
              size="lg" 
              onClick={handleNext} 
              disabled={!isAnswered}
              className="gap-2 w-full md:w-auto"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
