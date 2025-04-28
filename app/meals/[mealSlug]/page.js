import { getMeal } from "@/lib/meals";
import classes from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { mealSlug } = await params;
    const meal = await getMeal(mealSlug);

    if (!meal) {
        notFound();
    }
    return {
        title: meal.title,
        description: meal.summary,
    };
}

export default async function MealDetailsPage({ params }) {
    const { mealSlug } = await params;
    const meal = await getMeal(mealSlug);

    if (!meal) {
        notFound();
    }

    // Safely handle instructions - provide default if undefined/null
    const instructions = meal.instructions
        ? meal.instructions.replace(/\n/g, "<br />")
        : "No instructions provided";

    return (
        <>
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image src={meal.image} alt={meal.title} fill />
                </div>
                <div className={classes.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={classes.creator}>
                        by{" "}
                        <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
                    </p>
                    <p className={classes.summary}>{meal.summary}</p>
                </div>
            </header>
            <main
                className={classes.instructions}
                dangerouslySetInnerHTML={{ __html: instructions }}
            />
        </>
    );
}




