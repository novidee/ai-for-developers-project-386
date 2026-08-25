import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { errorHandler, notFound } from "./lib/errors.js";
import { validateBooking, validateEventType } from "./lib/validation.js";
import { MemoryStore } from "./store.js";

const publicDirectory = fileURLToPath(new URL("../public", import.meta.url));
const indexFile = path.join(publicDirectory, "index.html");

export function createApp(store = new MemoryStore()) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  if (fs.existsSync(indexFile)) {
    app.use(express.static(publicDirectory));

    app.get("*", (request, response, next) => {
      if (request.accepts(["json", "html"]) === "html") {
        response.sendFile(indexFile);
        return;
      }

      next();
    });
  }

  app.get("/owner", (_request, response) => {
    response.json(store.getOwner());
  });

  app.post("/owner/event-types", (request, response) => {
    response.json(store.createEventType(validateEventType(request.body)));
  });

  app.get("/owner/bookings", (_request, response) => {
    response.json({ items: store.listUpcomingBookings() });
  });

  app.get("/event-types", (_request, response) => {
    response.json({ items: store.listEventTypes() });
  });

  app.get("/event-types/:eventTypeId/slots", (request, response) => {
    response.json({ items: store.listAvailableSlots(request.params.eventTypeId) });
  });

  app.get("/event-types/:id", (request, response) => {
    response.json(store.getEventType(request.params.id));
  });

  app.post("/bookings", (request, response) => {
    const { slotId } = validateBooking(request.body);
    response.json(store.createBooking(slotId));
  });

  app.use((request, _response, next) => {
    next(notFound(`Маршрут ${request.method} ${request.path} не найден.`));
  });

  app.use(errorHandler);
  return app;
}
