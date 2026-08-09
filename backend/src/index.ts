import express from 'express';
import { configureApp } from './app.js';
import { loadConfig } from './config.js';
import { createLearningService } from './services/create-learning-service.js';

const config = loadConfig();
const app = configureApp(express(), {
  config,
  learningService: createLearningService(config),
});

export default app;
