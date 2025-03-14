const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key length:", apiKey ? apiKey.length : 0); // Debug log without exposing the key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are helping parents connect with their children and learn new words. You will receive the title of a toy, and language.  Based primarily on the title, pick 4 vocabulary words that are appropriate for children between the ages of 2 and 5.  Place higher priority on words that can be associated with sound - for instance \"Roar\", \"Neigh\", \"Gallop\", \"Munch\".  Then translate the words to the given language.  Only return the word and translated word.\n\nANIMALS:\nHorse: Neigh, Gallop, Trot, Munch\nAlligator: Chomp, Swim, Snap, Splash\nDuck: Quack, Waddle, Splash, Flap\nBee: Buzz, Fly, Hover, River\n\nTRANSPORTATION:\nHelicopter: Whirl, Hover, Spin, Fly\nAirplane: Zoom, Soar, Whoosh, Land\nTrain: Choo-choo, Rumble, Whistle, Clickety-clack\nRacecar: Vroom, Zoom, Skid, Honk\n\nSCIENCE FICTION:\nDarth Vader: Lightsaber, Breathe, Force, Blast\nRobot: Beep, Whir, Click, Stomp\nSpaceship: Zoom, Blast, Hover, Land\nLaser Gun: Zap, Shoot, Power, Aim\n\nMUSIC & INSTRUMENTS:\nDrum: Boom, Tap, Bang, Roll\nBell: Ring, Ding, Chime, Jingle\nFlute: Toot, Blow, Play, Whistle\nRattle: Shake, Jingle, Rattle, Twist\n\nWEATHER & NATURE:\nRain: Pitter-patter, Splash, Drip, Pour\nWind: Whoosh, Blow, Whistle, Swirl\nThunder: Boom, Crash, Rumble, Flash\nWater: Splash, Drip, Pour, Bubble\n\nSPORTS & PLAY:\nBasketball: Bounce, Dribble, Shoot, Swish\nSwimming: Splash, Kick, Float, Dive\nSoccer: Kick, Goal, Run, Cheer\nBaseball: Swing, Hit, Catch, Throw\n\nHOUSEHOLD:\nDoor: Open, Close, Knock, Squeak\nKitchen: Sizzle, Stir, Pour, Chop\nCloth: Rip, Fold, Crinkle, Swish\nClock: Tick-tock, Chime, Ring, Alarm\n\nCARTOON & FUN:\nBalloon: Pop, Squeak, Float, Stretch\nClown: Laugh, Honk, Giggle, Surprise\nMagic Wand: Swish, Sparkle, Tap, Twinkle\nSuperhero: Zoom, Pow, Save, Jump\n\nPEOPLE:\nBaby: Giggle, Coo, Babble, Clap\nDoctor: Listen, Tap, Check, Heal\nFriend: Greet, Laugh, Share, Play\nTeacher: Read, Count, Sing, Praise\nDancer: Tap, Spin, Twirl, Stomp\nChef: Chop, Stir, Sizzle, Taste\nFirefighter: Siren, Spray, Climb, Rescue\nFamily: Hug, Kiss, Whisper, Smile",
});

const generationConfig = {
  temperature: 1.15,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      VocabData: {
        type: "array",
        items: {
          type: "object",
          properties: {
            word: {
              type: "string"
            },
            translation: {
              type: "string"
            }
          },
          required: [
            "word",
            "translation"
          ]
        }
      }
    },
    required: [
      "VocabData"
    ]
  },
};


async function chooseVocabulary(toyTitle, language) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(`Toy Title: ${toyTitle}, Language: ${language}`);
  console.log(result.response.text());
  return result.response.text();
}

export { chooseVocabulary };
