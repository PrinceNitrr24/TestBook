import { useQuery } from "@tanstack/react-query";
import { Course, MockTest } from "@shared/schema";
import CourseCard from "@/components/course-card";
import MockTestCard from "@/components/mock-test-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("courses");

  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: mockTests, isLoading: isLoadingTests } = useQuery<MockTest[]>({
    queryKey: ["/api/mock-tests"],
  });

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTests = mockTests?.filter(test => 
    test.title.toLowerCase().includes(search.toLowerCase()) ||
    test.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Discover Your Next Learning Journey
        </h1>
        <p className="text-xl text-muted-foreground text-center mb-6 max-w-2xl">
          Access a wide range of courses and practice tests to enhance your skills and prepare for success.
        </p>
        <Input
          type="search"
          placeholder="Search courses and tests..."
          className="max-w-md w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="courses" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tests">Mock Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          {isLoadingCourses ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests">
          {isLoadingTests ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests?.map((test) => (
                <MockTestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}