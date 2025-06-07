import express from 'express';
import cors from 'cors';
import chatbotServiceInstance from './src/services/chatbotService.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const reply = await chatbotServiceInstance.getResponse(message);
  res.json({ reply });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 