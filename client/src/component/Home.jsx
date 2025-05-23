import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [personList, setPersonList] = useState([]);
  const [person, setPerson] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
   const [feild, setFeild] = useState('');

  // Fetch persons from backend
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/person-names');
        console.log(res.data);
        setPersonList(res.data); // assuming array of person objects with .name
      } catch (err) {
        console.error('Error fetching persons:', err);
      }
    };

    fetchPersons();

    // Preload voices to prevent delay
    window.speechSynthesis.getVoices();
  }, []);

   const speakText = (text) => {
    if (!text) return;

     // Cancel any previous speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

    // // Cancel any previous speech
    // window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      // Choose a good voice (Google voice preferred)
      // const voices = window.speechSynthesis.getVoices();
      // const preferred = voices.find(v => v.name.includes('Google')) || voices[0];
      // if (preferred) utterance.voice = preferred;

       // Get voices and pick an English one
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') && 
            (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('English'))
        );

        if (englishVoice) {
          utterance.voice = englishVoice;
        }

      utterance.onend = () => {
        console.log("✅ Finished speaking.");
      };

      utterance.onerror = (e) => {
        console.error("❌ Speech error:", e.error);
      };

      // window.speechSynthesis.speak(utterance);
      // Speak after a short delay to avoid conflicts
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    };

    if (speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', speak);
    } else {
      speak();
    }
  };


  const handleQuestionSubmit = async (e) => {
     console.log("person",{ person, question }); 
    e.preventDefault();
    if (!person || !question){
      setFeild("Missing person Or Question");
      setAnswer("");
       return ;
    }

    try {
      console.log({ person, question }); 
      const res = await axios.post('http://localhost:5000/api/ask', { person, question:question.trim() });
      console.log(res);
      //  const utterance = new SpeechSynthesisUtterance(res.data.answer);
      // speechSynthesis.speak(utterance);
      setAnswer(res.data.answer);
      setQuestion("");
      setFeild("");

    } catch (err) {

      console.error('Error fetching answer:', err);
    }
  };


  //  const handleSpeechInput = () => {
  //   if (!('webkitSpeechRecognition' in window)) {
  //     alert('Speech recognition not supported in this browser.');
  //     return;
  //   }

  //   const recognition = new window.webkitSpeechRecognition();
  //   recognition.lang = 'en-US';
  //   recognition.interimResults = false;
  //   recognition.maxAlternatives = 1;

  //   recognition.onresult = (event) => {
  //     const speechResult = event.results[0][0].transcript;
  //     setQuestion((prev) => `${prev} ${speechResult}`);
  //     // handleQuestionSubmit;
  //   };

  //   //  recognition.onresult = (event) => {
  //   //   const spokenQuestion = event.results[0][0].transcript;
  //   //   handleQuestionSubmit(spokenQuestion);
  //   // };

  //   recognition.onerror = (event) => {
  //     console.error('Speech recognition error:', event.error);
  //   };

  //   recognition.start();
  // };

  const handleSpeechInput = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = async (event) => {
    const speechResult = event.results[0][0].transcript;
    setQuestion(speechResult);

    // Wait for question to be set, then submit
    if (!person) {
      setFeild("Please select a person before speaking.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/ask', {
        person,
        question: speechResult.trim(),
      });

      setAnswer(res.data.answer);
      setQuestion("");
      setFeild("");
      console.log("speak",res.data.answer)
      console.log("res",res);

      
       if (res.data.audioUrl) {
          const audio = new Audio(res.data.audioUrl);
          audio.play();
        }

      // speakText(res.data.answer);

      // 🗣️ Speak the answer
      // const utterance = new SpeechSynthesisUtterance(res.data.answer);
      // speechSynthesis.speak(utterance);

    } catch (err) {
      console.error("Error from speech input:", err);
      setFeild("Error fetching answer.");
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.start();
};


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Ask a Question</h2>

      <select value={person} onChange={(e) => setPerson(e.target.value)}>
        <option value={''}>Select Person</option>
        {personList.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <br /><br />

      <textarea
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        cols={50}
      />

      <br /><br />
      <button onClick={handleSpeechInput} style={{ marginLeft: '10px' }}>
        🎤 Speak
      </button>

      <button onClick={handleQuestionSubmit}>Submit</button>
      {feild && (
        <div style={{ marginTop: '20px' }}>
          <strong>Error Occur:</strong> {feild}
        </div>
      )}

      {answer && (
        <div style={{ marginTop: '20px' }}>
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default Home;
