const db_url = process.env.DATABASE_URL || 'sqlite://./db.sqlite3'
const db_type = db_url.split('://')[0];

const db_options = db_type === 'sqlite' ? {
    "database": db_url.split('://')[1]
} : {
    "url": db_url
}

module.exports = Object.assign({
    "type": db_type,
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
}, db_options);