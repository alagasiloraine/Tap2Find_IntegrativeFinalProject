import { getDB } from "./db.js";

async function setupNotificationReads() {
  try {
    const db = getDB();
    console.log('✅ Connected to MongoDB Atlas');

    // Check if collection exists, if not create it
    const collections = await db.listCollections({ name: 'notification_reads' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('notification_reads');
      console.log('✅ Created notification_reads collection');
    } else {
      console.log('📁 notification_reads collection already exists');
    }

    const notificationReads = db.collection('notification_reads');
    
    // Create unique compound index
    try {
      await notificationReads.createIndex(
        { userId: 1, notificationId: 1 }, 
        { unique: true, name: 'user_notification_unique' }
      );
      console.log('✅ Created unique index on userId + notificationId');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict' || error.codeName === 'IndexKeySpecsConflict') {
        console.log('ℹ️  Unique index on userId + notificationId already exists');
      } else {
        throw error;
      }
    }

    // Create individual indexes
    try {
      await notificationReads.createIndex(
        { userId: 1 }, 
        { name: 'user_id_index' }
      );
      console.log('✅ Created index on userId');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Index on userId already exists');
      } else {
        throw error;
      }
    }

    try {
      await notificationReads.createIndex(
        { notificationId: 1 }, 
        { name: 'notification_id_index' }
      );
      console.log('✅ Created index on notificationId');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Index on notificationId already exists');
      } else {
        throw error;
      }
    }

    try {
      await notificationReads.createIndex(
        { readAt: 1 }, 
        { name: 'read_at_index' }
      );
      console.log('✅ Created index on readAt');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Index on readAt already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 All notification_reads indexes created successfully!');

    // Verify indexes
    const indexes = await notificationReads.indexes();
    console.log(`📊 Total indexes: ${indexes.length}`);
    indexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${index.name} - ${JSON.stringify(index.key)}`);
    });

  } catch (error) {
    console.error('❌ Error setting up notification_reads:', error);
    process.exit(1);
  }
}

// Run the setup
setupNotificationReads()
  .then(() => {
    console.log('Setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });