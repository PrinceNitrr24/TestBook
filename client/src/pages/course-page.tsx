import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursePage() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id;

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-6">{course.description}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span>${course.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Author ID: {course.authorId}</span>
              </div>
              <Button className="w-full">Enroll Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
