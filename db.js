const { error } = require("console");
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://lvelasquezh4:umg123@cluster0.qz8spoq.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

async function connect() {
  try {
    await client.connect();
    db = client.db("Proyecto1"); // base de datos

    console.log("Conecto con la Base de Datos");
  } catch (error) {
    console.error("Error con la Base de Datos:", error);
  }
}

function getDB() {
  return db;
}

module.exports = {
  connect,
  getDB,
};
