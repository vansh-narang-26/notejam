const { Pool } = require('pg');
const async = require('async');

const settings = require('./settings');
const pool = new Pool({
  host: "localhost",
  port: "5432",
  database: "db",
  user: "postgres",
  password: "5432 || 8000",
});

const functions = {
  createTables: function (next) {
    async.series({
      createUsers: function (callback) {
        pool.query(
          `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(75) NOT NULL,
            password VARCHAR(128) NOT NULL
          );`,
          [],
          function (err) {
            if (err) throw err;
            callback(null);
          }
        );
      },
      createPads: function (callback) {
        pool.query(
          `CREATE TABLE IF NOT EXISTS pads (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            user_id INTEGER NOT NULL REFERENCES users(id)
          );`,
          [],
          function (err) {
            if (err) throw err;
            callback(null);
          }
        );
      },
      createNotes: function (callback) {
        pool.query(
          `CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            pad_id INTEGER REFERENCES pads(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            name VARCHAR(100) NOT NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
          [],
          function (err) {
            if (err) throw err;
            callback(null);
          }
        );
      },
    },
    function (err, results) {
      next();
    });
  },

  applyFixtures: function (next) {
    this.truncateTables(function () {
      async.series([
        function (callback) {
          pool.query(
            `INSERT INTO users (email, password) VALUES 
             ('user1@example.com', '$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u');`,
            [],
            function (err) {
              if (err) throw err;
              callback(null);
            }
          );
        },
        function (callback) {
          pool.query(
            `INSERT INTO users (email, password) VALUES 
             ('user2@example.com', '$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u');`,
            [],
            function (err) {
              if (err) throw err;
              callback(null);
            }
          );
        },
        function (callback) {
          pool.query(`INSERT INTO pads (name, user_id) VALUES ('Pad 1', 1);`, [], function (err) {
            if (err) throw err;
            callback(null);
          });
        },
        function (callback) {
          pool.query(`INSERT INTO pads (name, user_id) VALUES ('Pad 2', 1);`, [], function (err) {
            if (err) throw err;
            callback(null);
          });
        },
        function (callback) {
          pool.query(
            `INSERT INTO notes (pad_id, user_id, name, text) VALUES (1, 1, 'Note 1', 'Text');`,
            [],
            function (err) {
              if (err) throw err;
              callback(null);
            }
          );
        },
        function (callback) {
          pool.query(
            `INSERT INTO notes (pad_id, user_id, name, text) VALUES (1, 1, 'Note 2', 'Text');`,
            [],
            function (err) {
              if (err) throw err;
              callback(null);
            }
          );
        },
      ], function (err, results) {
        next();
      });
    });
  },

  truncateTables: function (next) {
    async.series([
      function (callback) {
        pool.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`, [], function (err) {
          if (err) throw err;
          callback(null);
        });
      },
      function (callback) {
        pool.query(`TRUNCATE TABLE notes RESTART IDENTITY CASCADE;`, [], function (err) {
          if (err) throw err;
          callback(null);
        });
      },
      function (callback) {
        pool.query(`TRUNCATE TABLE pads RESTART IDENTITY CASCADE;`, [], function (err) {
          if (err) throw err;
          callback(null);
        });
      },
    ], function (err, results) {
      next();
    });
  },
};

if (require.main === module) {
  functions.createTables(function () {
    console.log('DB successfully initialized');
  });
}

module.exports = functions;
