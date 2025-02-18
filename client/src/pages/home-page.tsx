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
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
      <section className="pt-24 pb-16 px-4 bg-[#6F27F5] text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Your Future
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto">
              Access expert-led courses and realistic mock tests to accelerate your learning journey.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Input
                type="search"
                placeholder="Search courses and tests..."
                className="max-w-md w-full mx-auto bg-white/10 border-white/20 text-white placeholder:text-white/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: Book, value: "100+", label: "Courses" },
              { icon: Brain, value: "50+", label: "Mock Tests" },
              { icon: Users, value: "10k+", label: "Students" },
              { icon: Trophy, value: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-[#6F27F5]" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredCourses?.map((course, index) => (
                    <motion.div
                      key={course.id}
                      variants={fadeIn}
                    >
                      <CourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="tests">
              {isLoadingTests ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredTests?.map((test, index) => (
                    <motion.div
                      key={test.id}
                      variants={fadeIn}
                    >
                      <MockTestCard test={test} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}