// routes/ask.js
const express = require('express');
const router = express.Router();
const Person = require('../model/Person');
const axios = require('axios');
const { getPlayHTAudio } = require('./playhit');

async function getAnswerFromAI(prompt) {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistralai/mistral-7b-instruct',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.openApi}`,
        'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173/', 
          'X-Title': 'MyTestApp', 
      },
    }
  );

  return res.data.choices[0].message.content;
}


router.post('/', async (req, res) => {
  const { person, question } = req.body;
  console.log("person", person)

  try {
    if (!person || !question) {
      console.error('Missing person or question');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const personData = await Person.findById(person);
    console.log("persondata", personData)

    if (!personData) {
      console.error(`Person not found in DB: "${person}"`);
      return res.status(404).json({ error: `Person "${person}" not found` });
    }

    // const prompt = `Based on the following information about ${personData.name} (Bio: ${personData.bio}, Skills: ${personData.skills.join(', ')}), answer: ${question}`;

    const prompt = `
        Pretend you are ${personData.name}.

        Bio: ${personData.bio}
        Skills: ${personData.skills.join(', ')}
        age:${personData.age}

        Now, answer the following question **in the first person**, as if **you are ${personData.name}**, using "I", "my", "me", etc.

        Question: ${question}
        `;


    const answer = await getAnswerFromAI(prompt);
    console.log(answer);
    const audioUrl=await getPlayHTAudio(answer);
    console.log(audioUrl);
    res.json({ answer ,audioUrl});

  } catch (err) {
    console.error('Error in /api/ask:', err.message);
    res.status(500).json({ error: 'Error generating answer' });
  }
});



// router.post('/', async (req, res) => {
//   const { person, question } = req.body;

//   try {
//     const personData = await Person.findOne({ name: person });

//     if (!personData) {
//       return res.status(404).json({ error: 'Person not found' });
//     }

//     const prompt = `Based on the following information about ${personData.name} (Bio: ${personData.bio}, Skills: ${personData.skills.join(', ')}), answer: ${question}`;
//     const answer = await getAnswerFromAI(prompt);

//     res.json({ answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error generating answer' });
//   }
// });

module.exports = router;
