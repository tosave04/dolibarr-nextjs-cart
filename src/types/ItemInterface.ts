import { z } from "zod"

export const ItemSchema = z.object({
	// Custom cart fields
	type: z.string(),
	date: z.number().optional(),
	validite: z.number().optional(),
	keyCode: z.string().optional(),
	data: z.string().optional(),
	price: z.number(),

	// Dolibarr fields
	product_type: z.enum(["0", "1"]), // 0 = produit, 1 = service
	fk_product: z.number().optional(), // Id [produit existant]
	label: z.string().optional(), // Label [ligne libre]
	desc: z.string().optional(), // Description [ligne libre]
	array_options: z
		.object({
			produit_state: z.string().optional(),
			produit_raw: z.string().optional(), // Uniquement pour la création sur Dolibarr
			produit_canvas: z.string().optional(),
			surface_largeur: z.number().optional(),
			surface_hauteur: z.number().optional(),
			commentaire: z.string().optional(),
		})
		.optional(), // Options [ligne libre]
	subprice: z.number(), // Prix unitaire HT (price)
	remise_percent: z.number().optional(), // Remise en pourcentage
	tva_tx: z.number(), // Taux de TVA
	qty: z.number(), // Quantité
})

export interface Item extends z.infer<typeof ItemSchema> {}
