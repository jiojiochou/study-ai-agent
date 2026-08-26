// Create database-specific user in knowledge_hub db
db = db.getSiblingDB('knowledge_hub');
db.createUser({
  user: 'mongo_user',
  pwd: 'mongo_pass123',
  roles: [{ role: 'readWrite', db: 'knowledge_hub' }],
});

db.createCollection('document_content');
