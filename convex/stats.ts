import { query } from "./_generated/server";
import { v } from "convex/values";

export const getWeeklyStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const userId = identity.subject;

        // Calculate start of the week (Sunday)
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const logs = await ctx.db
            .query("meal_logs")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .filter((q) => q.gte(q.field("created_at"), startOfWeek.getTime()))
            .collect();

        // Aggregate by day
        const weeklyData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                name: date.toLocaleDateString("en-US", { weekday: "short" }),
                date: date.toISOString().split("T")[0],
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
            };
        });

        logs.forEach((log) => {
            const logDate = new Date(log.created_at);
            // Only process if within range (double check)
            if (logDate >= startOfWeek && logDate < endOfWeek) {
                // Calculate day index (0-6) from start of week
                const dayDiff = Math.floor(
                    (logDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (dayDiff >= 0 && dayDiff < 7) {
                    weeklyData[dayDiff].calories += log.calories;
                    weeklyData[dayDiff].protein += log.protein;
                    weeklyData[dayDiff].carbs += log.carbs;
                    weeklyData[dayDiff].fat += log.fat;
                }
            }
        });

        return weeklyData;
    },
});
