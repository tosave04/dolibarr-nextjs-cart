"use server"

import { hashFonction } from "./hashFonction"
import type { Item } from "../types/ItemInterface"

// Création d'un code de vérification d'intégrité pour les articles
export const generateKeyCode = (
	params: Pick<Item, "data" | "price" | "fk_product" | "label" | "desc" | "subprice" | "remise_percent" | "tva_tx">
) => {
	const { data, price, fk_product, label, desc, subprice, remise_percent, tva_tx } = params
	const key = { data, price, fk_product, label, desc, subprice, remise_percent, tva_tx }

	const hash = hashFonction(JSON.stringify(key))

	return hash
}
