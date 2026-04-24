import sequelize from "../config/database.js";

const migrate = async () => {
  try {
    console.log("🔄 Running migration: Adding time and floor fields to exercise_details...");

    await sequelize.query(`
      ALTER TABLE exercise_details ADD COLUMN time VARCHAR(255) NULL DEFAULT NULL AFTER level
    `);
    console.log("✅ Added time column");

    await sequelize.query(`
      ALTER TABLE exercise_details ADD COLUMN floor VARCHAR(255) NULL DEFAULT NULL AFTER time
    `);
    console.log("✅ Added floor column");

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
