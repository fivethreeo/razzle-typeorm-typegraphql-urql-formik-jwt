
module.exports = {
    // "url": process.env.DATABASE_URL,
    "database": './db.sqlite3',
    "type": process.env.DATABASE_TYPE || 'sqlite',
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entities/**/*.ts"
    ],
    "migrations": [
        "src/migrations/**/*.ts"
    ],
    "subscribers": [
        "src/subscribers/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migrations",
        "subscribersDir": "src/subscribers"
    }
};