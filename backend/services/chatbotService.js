import 'dotenv/config';
import OpenAI from "openai";

// Set up OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Assistant ID from the OpenAI platform
const ASSISTANT_ID = "asst_gFjUWAj687ExLPy7CzcnSBKA";

class ChatbotService {
  // Basic input validation for inquiries
  validateInput(message) {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return { isValid: false, error: "Please enter a valid inquiry." };
    }
    if (message.length > 500) {
      return { isValid: false, error: "Your inquiry is too long. Please keep it under 500 characters." };
    }
    return { isValid: true, message: message.trim() };
  }

  // Main method to get a response from the OpenAI Assistant
  async getResponse(message) {
    // Validate input
    const validation = this.validateInput(message);
    if (!validation.isValid) return validation.error;

    try {
      // Create a new thread for each inquiry (or reuse for ongoing chats)
      const thread = await openai.beta.threads.create();

      // Add the user's message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: validation.message,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: ASSISTANT_ID,
      });

      // Poll for completion (simple polling, production code should be more robust)
      let status;
      let runResult;
      do {
        runResult = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        status = runResult.status;
        if (status !== "completed") await new Promise(r => setTimeout(r, 1000));
      } while (status !== "completed");

      // Get the assistant's reply
      const messages = await openai.beta.threads.messages.list(thread.id);
      const reply = messages.data.find(msg => msg.role === "assistant");
      return reply?.content[0]?.text?.value || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "Sorry, there was an error processing your inquiry. Please try again later.";
    }
  }
}

const chatbotServiceInstance = new ChatbotService();
export default chatbotServiceInstance; 