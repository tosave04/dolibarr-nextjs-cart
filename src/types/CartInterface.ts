import { z } from "zod"
import { ItemSchema } from "./ItemInterface"

export const CartSchema = z.object({
	articles: z.array(ItemSchema),
	total_ht: z.number(),
	total_ttc: z.number(),
	total_tva: z.number(),
	qte_references: z.number(),
	qte_articles: z.number(),
})

export interface Cart extends z.infer<typeof CartSchema> {}
