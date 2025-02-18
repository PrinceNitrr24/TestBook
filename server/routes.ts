import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCourseSchema, insertMockTestSchema, insertTestAttemptSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Course routes
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getAllCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const course = await storage.getCourse(parseInt(req.params.id));
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.json(course);
  });

  app.post("/api/courses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse({
        ...courseData,
        authorId: req.user.id,
      });
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.errors);
      } else {
        throw error;
      }
    }
  });

  // Mock test routes
  app.get("/api/mock-tests", async (req, res) => {
    const tests = await storage.getAllMockTests();
    res.json(tests);
  });

  app.get("/api/mock-tests/:id", async (req, res) => {
    const test = await storage.getMockTest(parseInt(req.params.id));
    if (!test) {
      return res.status(404).send("Mock test not found");
    }
    res.json(test);
  });

  app.get("/api/mock-tests/:id/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const questions = await storage.getQuestionsByTestId(parseInt(req.params.id));
    res.json(questions);
  });

  app.post("/api/mock-tests", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const testData = insertMockTestSchema.parse(req.body);
      const test = await storage.createMockTest({
        ...testData,
        authorId: req.user.id,
      });
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.errors);
      } else {
        throw error;
      }
    }
  });

  // Test attempt routes
  app.get("/api/test-attempts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const attempts = await storage.getTestAttemptsByUser(req.user.id);
    res.json(attempts);
  });

  app.post("/api/test-attempts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const attemptData = insertTestAttemptSchema.parse(req.body);
      const attempt = await storage.createTestAttempt({
        ...attemptData,
        userId: req.user.id,
      });
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.errors);
      } else {
        throw error;
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}