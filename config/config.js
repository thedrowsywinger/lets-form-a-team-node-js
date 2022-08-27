
const connectionPoolOptions = {
  max: 300,
  idle: 30000,
  acquire: 60000,
};

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: connectionPoolOptions,
    logQueryParameters: process.env.LOG_SQL_QUERY_PARAMS,
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    dialect: "postgres",
    pool: connectionPoolOptions,
    logQueryParameters: process.env.LOG_SQL_QUERY_PARAMS,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: connectionPoolOptions,
    logQueryParameters: process.env.LOG_SQL_QUERY_PARAMS,
  },
};
