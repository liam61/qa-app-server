// database
const HOST = 'localhost';
const DB_NAME = 'qa-app';
const CONN_STR = `mongodb://${HOST}:27017/${DB_NAME}`;
// const CONN_STR = `mongodb://user:pass@${HOST}:27017/${DB_NAME}`;
const VERSION = 'v1';

// server
const PORT = 4000;

export { HOST, DB_NAME, CONN_STR, VERSION, PORT };
