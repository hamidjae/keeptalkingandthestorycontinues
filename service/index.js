require('dotenv').config();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';
let users = [];
let scores = [];

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  try {
    if (await findUser('email', req.body.email)) {
      return res.status(409).send({ msg: 'Existing user' });
    }

    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (err) {
    console.error('ERROR in /auth/create:', err);
    res.status(500).send({ msg: 'Failed to create user', error: err.message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await findUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      return res.send({ email: user.email });
    }

    res.status(401).send({ msg: 'Unauthorized' });
  } catch (err) {
    console.error('ERROR in /auth/login:', err);
    res.status(500).send({ msg: 'Login failed', error: err.message });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  } catch (err) {
    console.error('ERROR in /auth/logout:', err);
    res.status(500).send({ msg: 'Logout failed', error: err.message });
  }
});

const verifyAuth = async (req, res, next) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (err) {
    console.error('ERROR in verifyAuth:', err);
    res.status(500).send({ msg: 'Auth check failed', error: err.message });
  }
};

apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

apiRouter.get('/test', (_req, res) => {
  res.send({ msg: 'Backend is running' });
});

apiRouter.post('/tts', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send({ msg: 'Text is required' });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    console.log('VOICE ID USED:', process.env.ELEVENLABS_VOICE_ID);

    if (!apiKey || !voiceId) {
      return res.status(500).send({ msg: 'Missing ElevenLabs credentials' });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (err) {
    console.error('ERROR in /tts:', err);
    res.status(500).send({ msg: 'TTS failed', error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: passwordHash,
    token: uuid.v4(),
  };

  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});