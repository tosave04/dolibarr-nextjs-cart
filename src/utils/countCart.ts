import type { Item } from "../types/ItemInterface"
import type { Cart } from "../types/CartInterface"

export function countCart(articles: Item[]): Omit<Cart, "articles"> {
	const totaux = articles.reduce(
		(acc, article) => {
			const qty = article.qty
			const price = article.price
			const total_ht = financial(qty * price)
			const total_tva = financial(total_ht * (article.tva_tx / 100))
			const total_ttc = total_ht + total_tva

			return {
				total_ht: acc.total_ht + total_ht,
				total_tva: acc.total_tva + total_tva,
				total_ttc: acc.total_ttc + total_ttc,
				qte_references: acc.qte_references + 1,
				qte_articles: acc.qte_articles + qty,
			}
		},
		{ total_ht: 0, total_tva: 0, total_ttc: 0, qte_references: 0, qte_articles: 0 }
	)

	return totaux
}

export const financial = (x: number | string) => Math.round(parseFloat(x as string) * 100) / 100
