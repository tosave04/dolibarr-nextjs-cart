import type { Item } from "../types/ItemInterface"
import type { Cart } from "../types/CartInterface"

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
