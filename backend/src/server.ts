import app from './index.js';
import { loadConfig } from './config.js';

const { port } = loadConfig();

app.listen(port, () => {
  console.info(`SkillPilot API listening on http://localhost:${port}`);
});
