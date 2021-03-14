module.exports = {
    appUrl: process.env.BE_URL || 'http://localhost',
    port: process.env.BE_PORT || 8080,
    dbURL: process.env.DATABASE_URL || 'postgresql://postgres:secret@db/megaslot',
    dbOptions: {}
}