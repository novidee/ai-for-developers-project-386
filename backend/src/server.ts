import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 4010;

createApp().listen(port, () => {
  console.log(`Calendar booking backend слушает http://localhost:${port}`);
});
