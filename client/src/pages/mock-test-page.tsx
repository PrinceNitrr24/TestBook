import { useQuery } from "@tanstack/react-query";
import { MockTest, Question } from "@shared/schema";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function MockTestPage() {
  const [, params] = useRoute("/mock-test/:id");
  const testId = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: test, isLoading: isLoadingTest } = useQuery<MockTest>({
    queryKey: [`/api/mock-tests/${testId}`],
  });

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<Question[]>({
    queryKey: [`/api/mock-tests/${testId}/questions`],
  });

  // Set initial state when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
      if (test) {
        setTimeLeft(test.duration * 60);
      }
    }
  }, [questions, test]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || testCompleted) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!user || !test || !questions) return;

    setIsSubmitting(true);
    try {
      const correctAnswers = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctOption ? 1 : 0);
      }, 0);

      const score = Math.round((correctAnswers / questions.length) * 100);

      await apiRequest("POST", "/api/test-attempts", {
        userId: user.id,
        mockTestId: testId,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
      });

      setTestCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/test-attempts"] });

      toast({
        title: "Test Completed!",
        description: `You scored ${score}% (${correctAnswers}/${questions.length} correct)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test results",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTest || isLoadingQuestions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return <div>Test not found</div>;
  }

  if (testCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for completing the test. You can view your results in your profile.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <span>Question {currentQuestion + 1} of {questions.length}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-lg mb-6">{currentQuestionData.text}</p>
          <RadioGroup
            value={selectedAnswers[currentQuestion].toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedAnswers.includes(-1)}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={selectedAnswers[currentQuestion] === -1}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}