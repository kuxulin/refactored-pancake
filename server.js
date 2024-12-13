const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const Groq = require('groq-sdk');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({dest: 'uploads/'});
const port = 3000;

app.use(cors());
const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  const chatCompletion = await getGroqChatCompletion(userMessage);
  res.json({reply: chatCompletion.choices[0]?.message?.content || ""});
});

app.post('/transcript', upload.single('audio'), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'uploads', `${Date.now()}.m4a`);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving file.');
    }
    transcript_audio(targetPath).then(value => {
      res.status(200).json(value);
      fs.unlink(targetPath, err => err && console.error('Error deleting the file:', err));
    }).catch(error => {
      console.error('Error during transcription:', error);
      res.status(500).json({error: 'Error transcribing audio'});
    });
  });
});

async function transcript_audio(file_path) {
  return groq.audio.transcriptions.create({
    file: fs.createReadStream(file_path),
    model: "whisper-large-v3",
    prompt: "Specify context or spelling",
    response_format: "verbose_json",
    temperature: 0.0
  });
}

async function getGroqChatCompletion(userMessage) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content: "`You are a movie recommendation assistant for a website. \n" +
          "Your role is to help users find movies based on their preferences. \n" +
          "Additionally, if the user asks a question in Russian, respond in Ukrainian. \n" +
          "You love answering in Ukrainian and prefer to respond in Ukrainian if the question is not in English." +
          "`",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.25,
    model: "llama3-70b-8192",
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
