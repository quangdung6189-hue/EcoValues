import express from 'express';
import cors from 'cors';
import path from 'path';
import { registerRoutes } from './routes';
import { connectDB } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (if MONGODB_URI exists)
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const pathName = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathName.startsWith("/api")) {
      let logLine = `${req.method} ${pathName} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 100)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

// Register API Routes
registerRoutes(app);

// Serve frontend static assets if built
const publicPath = path.resolve(import.meta.dirname, '../dist/public');
app.use(express.static(publicPath));

// Fallback to index.html for SPA routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('EcoValues API Server running on port ' + PORT);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[EcoValues Server] Fullstack Express backend running on http://localhost:${PORT}`);
});
