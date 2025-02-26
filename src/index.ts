import express from 'express';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies';
import technologiesRouter from './routes/technologies';
import cors from 'cors';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(express.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// Utiliser le middleware CORS
app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre application React
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Routes
app.use('/api/companies', companiesRouter);
app.use('/api/technologies', technologiesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});