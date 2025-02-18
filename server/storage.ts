import { IStorage } from "./storage";
import { User, Course, MockTest, Question, TestAttempt, InsertUser, InsertCourse, InsertMockTest, InsertQuestion, InsertTestAttempt } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private mockTests: Map<number, MockTest>;
  private questions: Map<number, Question>;
  private testAttempts: Map<number, TestAttempt>;
  sessionStore: session.Store;
  private userCurrentId: number;
  private courseCurrentId: number;
  private mockTestCurrentId: number;
  private questionCurrentId: number;
  private testAttemptCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.mockTests = new Map();
    this.questions = new Map();
    this.testAttempts = new Map();
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.mockTestCurrentId = 1;
    this.questionCurrentId = 1;
    this.testAttemptCurrentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed initial data
    this.seedCourses();
    this.seedMockTests();
  }

  private seedCourses() {
    const courseImages = [
      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
      "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c",
      "https://images.unsplash.com/photo-1557804483-ef3ae78eca57",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    ];

    courseImages.forEach((imageUrl, index) => {
      this.courses.set(index + 1, {
        id: index + 1,
        title: `Sample Course ${index + 1}`,
        description: "This is a sample course description that showcases what you'll learn in this comprehensive program.",
        imageUrl,
        authorId: 1,
        duration: "10 weeks",
        price: 99,
        featured: index === 0,
      });
    });
    this.courseCurrentId = courseImages.length + 1;
  }

  private seedMockTests() {
    const testImages = [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    ];

    testImages.forEach((imageUrl, index) => {
      const testId = index + 1;
      this.mockTests.set(testId, {
        id: testId,
        title: `Mock Test ${testId}`,
        description: "Practice test to help you prepare for your upcoming examination.",
        duration: 60,
        totalQuestions: 50,
        difficulty: index === 0 ? "Beginner" : index === 1 ? "Intermediate" : "Advanced",
        imageUrl,
        authorId: 1,
        featured: index === 0,
      });

      // Add sample questions for each test
      for (let i = 1; i <= 5; i++) {
        const questionId = this.questionCurrentId++;
        this.questions.set(questionId, {
          id: questionId,
          mockTestId: testId,
          text: `Sample question ${i} for test ${testId}`,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          correctOption: Math.floor(Math.random() * 4),
          explanation: "This is the explanation for the correct answer."
        });
      }
    });
    this.mockTestCurrentId = testImages.length + 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Mock test methods
  async getAllMockTests(): Promise<MockTest[]> {
    return Array.from(this.mockTests.values());
  }

  async getMockTest(id: number): Promise<MockTest | undefined> {
    return this.mockTests.get(id);
  }

  async createMockTest(insertMockTest: InsertMockTest): Promise<MockTest> {
    const id = this.mockTestCurrentId++;
    const mockTest: MockTest = { ...insertMockTest, id };
    this.mockTests.set(id, mockTest);
    return mockTest;
  }

  // Question methods
  async getQuestionsByTestId(testId: number): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      (question) => question.mockTestId === testId,
    );
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionCurrentId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  // Test attempt methods
  async getTestAttemptsByUser(userId: number): Promise<TestAttempt[]> {
    return Array.from(this.testAttempts.values()).filter(
      (attempt) => attempt.userId === userId,
    );
  }

  async createTestAttempt(insertAttempt: InsertTestAttempt): Promise<TestAttempt> {
    const id = this.testAttemptCurrentId++;
    const attempt: TestAttempt = { ...insertAttempt, id };
    this.testAttempts.set(id, attempt);
    return attempt;
  }
}

export const storage = new MemStorage();