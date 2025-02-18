import { useQuery } from "@tanstack/react-query";
import { Course, MockTest } from "@shared/schema";
import CourseCard from "@/components/course-card";
import MockTestCard from "@/components/mock-test-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Book, Brain, Users, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Footer from "@/components/footer";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary/5 via-primary/10 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Master Your Future
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Access expert-led courses and realistic mock tests to accelerate your learning journey.
          </p>
          <Input
            type="search"
            placeholder="Search courses and tests..."
            className="max-w-md w-full mx-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <Book className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-2xl font-bold">100+</div>
              <div className="text-muted-foreground">Courses</div>
            </Card>
            <Card className="p-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-2xl font-bold">50+</div>
              <div className="text-muted-foreground">Mock Tests</div>
            </Card>
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-muted-foreground">Students</div>
            </Card>
            <Card className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-2xl font-bold">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
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
      </section>

      <Footer />
    </div>
  );
}