"use server"

import { countCart } from "./countCart"
import { Cart } from "../types"
import { generateKeyCode } from "./generateKeyCode"

export function verifCart(panier: Cart) {
	// On vérifie que les articles n'ont pas été modifiés
	const verif_articles = panier.items.every((item) => item.keyCode === generateKeyCode(item))

	// On vérifie les totaux du panier
	const calcul_panier = countCart(panier.items)

	const verif_ht = calcul_panier.total_ht === panier.total_ht
	const verif_ttc = calcul_panier.total_ttc === panier.total_ttc
	const verif_tva = calcul_panier.total_tva === panier.total_tva
	const verif_references_qty = calcul_panier.references_qty === panier.references_qty
	const verif_items_qty = calcul_panier.items_qty === panier.items_qty

	const check = verif_articles && verif_ht && verif_ttc && verif_tva && verif_references_qty && verif_items_qty

	if (!check && process.env.NODE_ENV === "development")
		console.error(verif_articles, verif_ht, verif_ttc, verif_tva, verif_references_qty, verif_items_qty)

	return check
}
