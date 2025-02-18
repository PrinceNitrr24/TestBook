import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCourseSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
