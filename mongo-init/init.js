db = db.getSiblingDB(process.env.MONGO_DB || "netflixclone");

db.createUser({
  user: process.env.MONGO_USER || "mongoadmin",
  pwd: process.env.MONGO_PASS || "Admin1342*Mongo",
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_DB || "netflixclone"
    }
  ]
});

// Optional: Create a default collection and seed some data
db.createCollection("users");

db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date()
});