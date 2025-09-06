# Database Scripts

This directory contains utility scripts for database operations.

## Seed Script

The `seed.ts` script populates the database with sample data for development and testing purposes.

### Features

- Creates 10 users with realistic fake data
- Generates 5 conversations between different user pairs
- Adds 5-15 messages per conversation with varied content
- Establishes friend relationships between users
- Provides detailed logging and progress indicators
- Includes proper error handling and cleanup

### Usage

```bash
# Run the seed script
npm run seed

# Or run directly with ts-node
npx ts-node ./scripts/seed.ts
```

### Environment Requirements

Make sure you have the following environment variables set in your `.env.development` file:

```
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### What Gets Created

- **Users**: 10 users with fake names, usernames, genders, and generated profile pictures
- **Conversations**: 5 conversations between different user pairs
- **Messages**: 5-15 messages per conversation (25-75 total messages)
- **Friendships**: Friend relationships between paired users

### Login Credentials

All seeded users have the same password for testing purposes:

- **Password**: `password123`
- **Usernames**: Generated fake usernames (displayed in console output)

The passwords are properly hashed using bcrypt, just like in production.

### Safety

⚠️ **Warning**: This script will **DELETE ALL EXISTING DATA** in your database before seeding new data. Only run this in development environments.

### Customization

You can modify the script to:

- Change the number of users, conversations, or messages
- Add different types of relationships
- Include additional data fields
- Modify the fake data generation patterns
