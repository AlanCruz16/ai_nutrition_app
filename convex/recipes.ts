import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRecipes = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const userId = identity.subject;

        return await ctx.db
            .query("recipes")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .collect();
    },
});

export const saveRecipe = mutation({
    args: {
        name: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;

        await ctx.db.insert("recipes", {
            user_id: userId,
            name: args.name,
            description: args.description,
        });
    },
});
