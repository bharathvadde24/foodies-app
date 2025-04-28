'use server';
import { revalidatePath } from "next/cache";
import { saveMeal } from "./meals";
import { redirect } from "next/navigation";

function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
    try {
        const meal = {
            title: formData.get('title'),
            summary: formData.get('summary'),
            instructions: formData.get('instructions'),
            image: formData.get('image'),
            creator: formData.get('name'),
            creator_email: formData.get('email')
        };

        // Validate image
        if (!meal.image || meal.image.size === 0) {
            return { error: 'Please select an image' };
        }

        // if (!meal.title || meal.title.trim() === '');\\

        if (
            isInvalidText(meal.title) ||
            isInvalidText(meal.summary) ||
            isInvalidText(meal.instructions) ||
            isInvalidText(meal.creator) ||
            isInvalidText(meal.creator_email) ||
            !meal.creator_email.includes('@') ||
            !meal.image || meal.image.size === 0
        ) {
            // throw new Error('Invalid input');
            return {
                message: 'Invalid input.'
            };
        }

        await saveMeal(meal);
        revalidatePath('/meals');
        redirect('/meals');
    } catch (error) {
        // Don't log redirect errors
        if (error.message !== 'NEXT_REDIRECT') {
            console.error('Failed to share meal:', error);
            return { error: 'Failed to share meal. Please try again.' };
        }
        // Re-throw redirect errors so Next.js can handle them
        throw error;
    }
}
