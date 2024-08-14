import type { Cart, Item } from "../types"

/**
 * Calculates the total values for a cart based on its items.
 *
 * This function processes an array of items and calculates several totals:
 * - `total_ht`: Total amount before tax (excluding VAT)
 * - `total_tva`: Total amount of VAT
 * - `total_ttc`: Total amount including VAT
 * - `references_qty`: Total number of unique items
 * - `items_qty`: Total quantity of all items
 *
 * Each item's total amount before tax, VAT, and total amount including tax are calculated based on its
 * quantity, price, and VAT rate. The results are accumulated and returned.
 *
 * @param {Item[]} items - An array of items, where each item includes properties such as quantity, price, and VAT rate.
 * @returns {Omit<Cart, "items">} An object containing the computed totals for the cart.
 */
export function countCart(items: Item[]): Omit<Cart, "items"> {
	const totaux = items.reduce(
		(acc, item) => {
			const qty = item.qty
			const price = item.price
			const total_ht = financial(qty * price)
			const total_tva = financial(total_ht * (item.tva_tx / 100))
			const total_ttc = total_ht + total_tva

			return {
				total_ht: acc.total_ht + total_ht,
				total_tva: acc.total_tva + total_tva,
				total_ttc: acc.total_ttc + total_ttc,
				references_qty: acc.references_qty + 1,
				items_qty: acc.items_qty + qty,
			}
		},
		{ total_ht: 0, total_tva: 0, total_ttc: 0, references_qty: 0, items_qty: 0 }
	)

	return totaux
}

export const financial = (x: number | string) => Math.round(parseFloat(x as string) * 100) / 100
