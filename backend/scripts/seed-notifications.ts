import mongoose from "mongoose";
import User from "../src/models/user.model.ts";
import Notification from "../src/models/notification.model.ts";
import { faker } from "@faker-js/faker";
import { NotificationTypes } from "../../shared/types/NotificationTypes.ts";

import "dotenv-flow/config";

// Database connection URI
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI environment variable is not set");
  process.exit(1);
}

// Function to generate notification messages based on type
const generateNotificationMessage = (
  type: string,
  senderName: string,
): string => {
  switch (type) {
    case NotificationTypes.NewFriendRequest:
      return `${senderName} sent you a friend request`;
    case NotificationTypes.FriendRequestAccepted:
      return `${senderName} accepted your friend request`;
    case NotificationTypes.FriendRequestRejected:
      return `${senderName} rejected your friend request`;
    case NotificationTypes.RemoveFriendShip:
      return `${senderName} removed you from their friends list`;
    default:
      return `${senderName} sent you a notification`;
  }
};

// Enhanced notification seeding script
const seedNotifications = async () => {
  try {
    console.log("🔔 Starting notification seeding...");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users from the database
    const users = await User.find({}).limit(50); // Limit to 50 users for performance

    if (users.length === 0) {
      console.error(
        "❌ No users found in database. Please run the main seed script first.",
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📊 Found ${users.length} users in database`);

    // Ask for target user (you can modify this to target a specific user)
    const targetUser = users[0]; // Using first user as target, you can change this
    console.log(
      `🎯 Target user: ${targetUser.fullName} (${targetUser.username})`,
    );

    // Clear existing notifications for the target user
    console.log("🧹 Clearing existing notifications for target user...");
    await Notification.deleteMany({ receiverId: targetUser._id });
    console.log("✅ Old notifications cleared");

    // Generate notifications
    console.log("🔔 Creating notifications...");
    const notificationCount = 1000; // You can adjust this number
    const notifications: any[] = [];

    const notificationTypes = Object.values(NotificationTypes);

    for (let i = 0; i < notificationCount; i++) {
      // Randomly select a sender (excluding the target user)
      const availableSenders = users.filter(
        (user) => user._id.toString() !== targetUser._id.toString(),
      );
      const sender = faker.helpers.arrayElement(availableSenders);

      // Randomly select a notification type
      const type = faker.helpers.arrayElement(notificationTypes);

      // Generate notification message
      const message = generateNotificationMessage(type, sender.fullName);

      // Randomly set read status (70% unread, 30% read)
      const readed = faker.datatype.boolean({ probability: 0.3 });

      // Create notification with random timestamp within last 30 days
      const createdAt = faker.date.recent({ days: 30 });

      const notification = new Notification({
        senderId: sender._id,
        receiverId: targetUser._id,
        type,
        message,
        readed,
        createdAt,
      });

      notifications.push(notification);
    }

    // Save all notifications in batches for better performance
    console.log("💾 Saving notifications to database...");
    const batchSize = 100;
    let savedCount = 0;

    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await Notification.insertMany(batch);
      savedCount += batch.length;
      console.log(
        `📝 Saved ${savedCount}/${notifications.length} notifications`,
      );
    }

    // Display summary
    console.log("\n📊 Notification Seeding Summary:");
    console.log(
      `   🎯 Target user: ${targetUser.fullName} (${targetUser.username})`,
    );
    console.log(`   🔔 Total notifications: ${notifications.length}`);
    console.log(
      `   📖 Read notifications: ${notifications.filter((n) => n.readed).length}`,
    );
    console.log(
      `   📭 Unread notifications: ${notifications.filter((n) => !n.readed).length}`,
    );

    // Show breakdown by type
    const typeBreakdown = notificationTypes.map((type) => {
      const count = notifications.filter((n) => n.type === type).length;
      return `   ${type}: ${count}`;
    });
    console.log("\n📋 Breakdown by type:");
    typeBreakdown.forEach((line) => console.log(line));

    await mongoose.disconnect();
    console.log(
      "\n✅ Notification seeding completed successfully and disconnected from MongoDB",
    );
  } catch (error) {
    console.error("❌ Error during notification seeding:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Function to generate notifications for multiple users
const seedNotificationsForMultipleUsers = async () => {
  try {
    console.log("🔔 Starting bulk notification seeding for multiple users...");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users from the database
    const users = await User.find({}).limit(20); // Limit to 20 users for performance

    if (users.length === 0) {
      console.error(
        "❌ No users found in database. Please run the main seed script first.",
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📊 Found ${users.length} users in database`);

    // Clear all existing notifications
    console.log("🧹 Clearing all existing notifications...");
    await Notification.deleteMany({});
    console.log("✅ All notifications cleared");

    // Generate notifications for each user
    const notificationsPerUser = 50; // You can adjust this number
    const allNotifications: any[] = [];
    const notificationTypes = Object.values(NotificationTypes);

    for (const targetUser of users) {
      console.log(
        `🔔 Creating ${notificationsPerUser} notifications for ${targetUser.fullName}...`,
      );

      for (let i = 0; i < notificationsPerUser; i++) {
        // Randomly select a sender (excluding the target user)
        const availableSenders = users.filter(
          (user) => user._id.toString() !== targetUser._id.toString(),
        );
        const sender = faker.helpers.arrayElement(availableSenders);

        // Randomly select a notification type
        const type = faker.helpers.arrayElement(notificationTypes);

        // Generate notification message
        const message = generateNotificationMessage(type, sender.fullName);

        // Randomly set read status (70% unread, 30% read)
        const readed = faker.datatype.boolean({ probability: 0.3 });

        // Create notification with random timestamp within last 30 days
        const createdAt = faker.date.recent({ days: 30 });

        const notification = new Notification({
          senderId: sender._id,
          receiverId: targetUser._id,
          type,
          message,
          readed,
          createdAt,
        });

        allNotifications.push(notification);
      }
    }

    // Save all notifications in batches for better performance
    console.log("💾 Saving notifications to database...");
    const batchSize = 100;
    let savedCount = 0;

    for (let i = 0; i < allNotifications.length; i += batchSize) {
      const batch = allNotifications.slice(i, i + batchSize);
      await Notification.insertMany(batch);
      savedCount += batch.length;
      console.log(
        `📝 Saved ${savedCount}/${allNotifications.length} notifications`,
      );
    }

    // Display summary
    console.log("\n📊 Bulk Notification Seeding Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🔔 Notifications per user: ${notificationsPerUser}`);
    console.log(`   🔔 Total notifications: ${allNotifications.length}`);
    console.log(
      `   📖 Read notifications: ${allNotifications.filter((n) => n.readed).length}`,
    );
    console.log(
      `   📭 Unread notifications: ${allNotifications.filter((n) => !n.readed).length}`,
    );

    await mongoose.disconnect();
    console.log(
      "\n✅ Bulk notification seeding completed successfully and disconnected from MongoDB",
    );
  } catch (error) {
    console.error("❌ Error during bulk notification seeding:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || "single";

  if (mode === "bulk") {
    await seedNotificationsForMultipleUsers();
  } else {
    await seedNotifications();
  }
};

main();
