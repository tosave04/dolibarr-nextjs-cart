import { z } from "zod"
import { ItemSchema } from "./ItemInterface"

export const CartSchema = z.object({
	items: z.array(ItemSchema),
	total_ht: z.number(),
	total_ttc: z.number(),
	total_tva: z.number(),
	references_qty: z.number(),
	items_qty: z.number(),
})

export interface Cart extends z.infer<typeof CartSchema> {}
