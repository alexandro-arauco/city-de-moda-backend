import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

export function validateQuery(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid query parameters", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

export function validateParams(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid URL parameters", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

export function validateFiles(
  maxSize: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/gif"]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No files uploaded" });
    }

    const files = Array.isArray(req.files)
      ? req.files
      : Object.values(req.files);

    for (const file of files) {
      if (file.size > maxSize) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            error: `File ${file.name} exceeds maximum size of ${
              maxSize / (1024 * 1024)
            }MB`,
          });
      }

      if (!allowedTypes.includes(file.mimetype)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            error: `File ${
              file.name
            } has invalid type. Allowed types: ${allowedTypes.join(", ")}`,
          });
      }
    }

    next();
  };
}

export function validateDataAndFiles(
  schema: z.ZodObject<any, any>,
  maxFileSize: number = 5 * 1024 * 1024,
  allowedFileTypes: string[] = ["image/jpeg", "image/png", "image/gif"]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
        return;
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
        return;
      }
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "No files uploaded" });
      return;
    }

    // Handle both single objects and arrays of objects
    const files = Object.values(req.files).flatMap(file => {
      if (Array.isArray(file)) {
        return file;
      }
      return [file];
    });

    for (const file of files) {
      if (file.size > maxFileSize) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: `File ${file.name} exceeds maximum size of ${
            maxFileSize / (1024 * 1024)
          }MB`,
        });
        return;
      }

      if (!allowedFileTypes.includes(file.mimetype)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: `File ${
            file.name
          } has invalid type. Allowed types: ${allowedFileTypes.join(", ")}`,
        });
        return;
      }
    }

    next();
  };
}
