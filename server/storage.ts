import { IStorage } from "./storage";
import { User, Course, InsertUser, InsertCourse } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  sessionStore: session.Store;
  private userCurrentId: number;
  private courseCurrentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCurrentId = 1;
    this.courseCurrentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed some initial courses
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
}

export const storage = new MemStorage();
