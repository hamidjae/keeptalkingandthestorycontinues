const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');

const userCollection = db.collection('user');
const scoreCollection = db.collection('score');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to database');
  } catch (ex) {
    console.error(`Unable to connect to database because ${ex.message}`);
    process.exit(1);
  }
})();

async function getUser(email) {
  return userCollection.findOne({ email });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function createUser(user) {
  await userCollection.insertOne(user);
  return user;
}

async function updateUserToken(email, token) {
  await userCollection.updateOne({ email }, { $set: { token } });
}

async function clearUserToken(token) {
  await userCollection.updateOne({ token }, { $unset: { token: "" } });
}

async function addScore(score) {
  await scoreCollection.insertOne(score);
}

async function getHighScores() {
  return scoreCollection.find().sort({ score: -1 }).limit(10).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  updateUserToken,
  clearUserToken,
  addScore,
  getHighScores,
};