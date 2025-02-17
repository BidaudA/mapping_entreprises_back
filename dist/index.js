"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const companies_1 = __importDefault(require("./routes/companies"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
// Utiliser le middleware CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre application React
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));
// Routes
app.use('/api/companies', companies_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
