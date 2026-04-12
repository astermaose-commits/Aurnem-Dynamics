import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyAR7gij606FxdKMs7uZTuGbu-UgXk8WOqI";

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name));
  } catch(e) {
    console.error("Error listing models:", e);
  }
}

run();
