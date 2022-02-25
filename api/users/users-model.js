const db = require("../../data/dbConfig");

/**
  resolves to a user with all users that match the filter condition
 */
function findByUsername(username) {
  return db("users").where({ username: username }).first();
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db("users")
    .select("user_id", "username")
    .where("user_id", user_id)
    .first();
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

module.exports = {
  findByUsername,
  findById,
  add,
};
