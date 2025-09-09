import mongoose from "mongoose";
import User from "../src/models/user.model.ts";
import Conversation from "../src/models/conversation.model.ts";
import Message from "../src/models/message.model.ts";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import type { UserDocument } from "../../shared/types/models/user";
import type { IMessage } from "../../shared/types/models/message";

// Local function to generate profile picture (same logic as auth.utils.ts)
const generateProfilePic = (username: string, gender: string): string => {
  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
  return gender === "male" ? boyProfilePic : girlProfilePic;
};

import "dotenv-flow/config";

// Database connection URI
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Enhanced seeding script
const seedDB = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log("✅ Old data cleared");

    // Create users with proper typing
    console.log("👥 Creating users...");
    const users: UserDocument[] = [];

    // Create 10 users for better testing
    for (let i = 0; i < 10; i++) {
      const plainPassword = "password123";
      const hashedPassword = bcrypt.hashSync(plainPassword, 10);
      const gender = faker.helpers.arrayElement(["male", "female"]);
      const username = faker.internet.username().toLowerCase();

      const user = new User({
        fullName: faker.person.fullName(),
        username: username,
        password: hashedPassword,
        gender: gender,
        profilePic: generateProfilePic(username, gender),
        friends: [],
        pendingFriendships: [],
      });

      await user.save();
      users.push(user);
    }

    console.log(`✅ ${users.length} users created`);

    // Create multiple conversations
    console.log("💬 Creating conversations...");
    const conversations: any[] = [];

    // Create 5 conversations with different participants
    for (let i = 0; i < 5; i++) {
      const participant1 = users[i * 2];
      const participant2 = users[i * 2 + 1];

      const conversation = new Conversation({
        participants: [
          { userId: participant1._id, unreadCount: 0 },
          { userId: participant2._id, unreadCount: 0 },
        ],
        messages: [],
      });

      await conversation.save();
      conversations.push(conversation);
    }

    console.log(`✅ ${conversations.length} conversations created`);

    // Add messages to conversations
    console.log("📝 Creating messages...");
    const allMessages: IMessage[] = [];

    for (const conversation of conversations) {
      const participants = conversation.participants;
      const messageCount = faker.number.int({ min: 5, max: 15 });

      for (let i = 0; i < messageCount; i++) {
        const sender = participants[i % participants.length].userId;

        const message = new Message({
          senderId: sender,
          message: faker.lorem.sentence(faker.number.int({ min: 3, max: 20 })),
          replayTo: null,
        });

        await message.save();
        allMessages.push(message);

        // Add message to conversation
        conversation.messages.push(message._id);
      }

      await conversation.save();
    }

    console.log(`✅ ${allMessages.length} messages created`);

    // Create some friend relationships
    console.log("👫 Creating friend relationships...");
    let friendCount = 0;

    for (let i = 0; i < users.length; i += 2) {
      if (i + 1 < users.length) {
        const user1 = users[i];
        const user2 = users[i + 1];

        // Add each other as friends
        user1.friends.push(user2._id);
        user2.friends.push(user1._id);

        await user1.save();
        await user2.save();
        friendCount += 2;
      }
    }

    console.log(`✅ ${friendCount} friend relationships created`);

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   💬 Conversations: ${conversations.length}`);
    console.log(`   📝 Messages: ${allMessages.length}`);
    console.log(`   👫 Friend relationships: ${friendCount}`);
    console.log("\n🔑 Login Credentials:");
    console.log("   All users have password: password123");
    console.log("   Use any of the generated usernames to login");

    await mongoose.disconnect();
    console.log(
      "✅ Seeding completed successfully and disconnected from MongoDB",
    );
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();
