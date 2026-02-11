const Activity = require("../models/Activity");

const logActivity = async (userId, action, resourceId = null, resourceType = null) => {
    try {
        await Activity.create({
            user: userId,
            action,
            resourceId,
            resourceType
        });
    } catch (error) {
        console.error("Activity logging failed:", error.message);
    }
};

module.exports = logActivity;
