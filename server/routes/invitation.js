const express = require('express');
const router = express.Router();
const Invitation = require('../model/InvitaionModel');
const axios = require('axios');

// let chatHistory = [];

// async function getAIResponse(userMessage) {
//   const invitation = await Invitation.findOne().sort({ createdAt: -1 });

//   const prompt = `Use this event info:\nEvent: ${invitation.eventName}\nDate: ${invitation.date}\nLocation: ${invitation.location}\nHost: ${invitation.hostName}\nMore: ${invitation.additionalInfo}\n\nConversation:\n${chatHistory.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')}\nUser: ${userMessage}`;

//   const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
//     model: 'gpt-3.5-turbo',
//     messages: [
//       { role: 'system', content: 'You are a friendly assistant giving invitation details.' },
//       ...chatHistory,
//       { role: 'user', content: userMessage }
//     ]
//   }, {
//     headers: {
//       Authorization: `Bearer ${process.env,openApi}`,
//       'Content-Type': 'application/json',
//       'HTTP-Referer': 'http://localhost:5173/', 
//       'X-Title': 'MyTestApp',
//     }
//   });

//   const aiReply = res.data.choices[0].message.content;
//   chatHistory.push({ role: 'user', content: userMessage });
//   chatHistory.push({ role: 'assistant', content: aiReply });
//   return aiReply;
// }


// const chatStages = [
//   "Start with a friendly hello or hi.",
//   "Wait for user's greeting, then reply with a warm greeting.",
//   "Wait for user's warm response, then give the full invitation.",
//   "Wait for user's final thank-you or reply."
// ];


// const chatStages = [
//   "Start with a friendly hello or hi.",
//   "Wait for user's greeting, then reply with a warm greeting.",
//   "Wait for user's warm response, then say you have an invitation.",
//   "Wait for user's interest or thanks, then give the full invitation.",
//   "Wait for user’s follow-up questions or wrap-up."
// ];

// const chatStages = [
//   "Start with a friendly hello or hi.",
//   "Wait for user's greeting, then reply with a warm greeting.",
//   "Wait for user's warm response, then share that there's an invitation from a person (not AI).",
//   "Wait for user's interest or thanks, then give the basic invitation (event name only).",
//   "Wait for follow-up or thanks, then provide full details (location, date, host, additional info).",
//   "Wait for any wrap-up or questions (answer or say info not available)."
// ];


const chatStages = [
  "Start with a simple 'Hello!' or 'Hi!'",                            // Stage 0
  "Wait for user's greeting, then reply with a warm greeting.",     // Stage 1
  "Wait for user's warm reply, then say: I want to invite you to {event name}.", // Stage 2
  "Wait for user's interest or thanks, then give the full invitation details ( date, location, host).", // Stage 3
  "If user asks about event details (host, venue, etc.), respond based on available data, or say you don’t know.", // Stage 4
  "If user thanks you or closes, say 'You're welcome' and offer further help." // Stage 5
];



async function getAIResponse(chatHistory=[], userMessage) {
  const invitation = await Invitation.findOne().sort({ createdAt: -1 });

  // Determine the stage based on message count
  const stage = Math.min(chatHistory.length-1, chatStages.length - 1);

  const systemPrompt = `
You are a polite and friendly assistant. You're having a back-and-forth conversation leading to delivering an invitation doing some warm greeting in stage 2.

Invitation Info:
- Event: ${invitation.eventName}
- Date: ${invitation.date}
- Location: ${invitation.location}
- Host: ${invitation.hostName}
- More Info: ${invitation.additionalInfo}

Follow this conversational flow step-by-step:
1. ${chatStages[0]}
2. ${chatStages[1]}
3. ${chatStages[2]}
4. ${chatStages[3]}
5. ${chatStages[4]}
6. ${chatStages[5]}

Now continue the chat, based on where we are in the flow.
`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages
  }, {
    headers: {
      Authorization: `Bearer ${process.env.openApi}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173/', 
      'X-Title': 'MyTestApp',
    }
  });

  return response.data.choices[0].message.content;
}


// Save invitation data
router.post('/', async (req, res) => {
  try {
    const newInvitation = new Invitation(req.body);
    await newInvitation.save();
    chatHistory = []; // Reset chat when a new invitation is created
    res.status(201).json({ message: 'Invitation saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save invitation' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { history, message } = req.body;

    const reply = await getAIResponse(history, message);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating response' });
  }
});


module.exports = router;