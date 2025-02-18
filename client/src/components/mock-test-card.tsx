import { MockTest } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Award, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

interface MockTestCardProps {
  test: MockTest;
}

export default function MockTestCard({ test }: MockTestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={test.imageUrl}
        alt={test.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-xl">{test.title}</h3>
          <Badge className={getDifficultyColor(test.difficulty)}>
            {test.difficulty}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {test.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{test.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{test.totalQuestions} questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/mock-test/${test.id}`}>
          <Button className="w-full">Start Test</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
