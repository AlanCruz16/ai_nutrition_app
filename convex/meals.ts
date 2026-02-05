import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMeals = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const userId = identity.subject;

        return await ctx.db
            .query("meal_logs")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .order("desc")
            .collect();
    },
});

export const logMeal = mutation({
    args: {
        description: v.string(),
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fat: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;

        await ctx.db.insert("meal_logs", {
            user_id: userId,
            description: args.description,
            calories: args.calories,
            protein: args.protein,
            carbs: args.carbs,
            fat: args.fat,
            created_at: Date.now(),
        });
    },
});

export const deleteMeal = mutation({
    args: {
        id: v.id("meal_logs"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;

        const meal = await ctx.db.get(args.id);
        if (!meal) {
            // Meal might already be deleted or doesn't exist
            return;
        }

        if (meal.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});
