import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createLearningService } from './services/create-learning-service.js';

const config = loadConfig();
const app = createApp({ config, learningService: createLearningService(config) });

export default app;
