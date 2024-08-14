import type { Line } from "@tosave04/dolibarr-utils-ts"
import type { Item } from "../types"

export const convertItem2Line = (item: Item): Line => ({
	product_type: item.product_type,
	fk_product: item.fk_product,
	label: item.label,
	desc: item.desc,
	array_options: item.array_options,
	subprice: item.subprice,
	remise_percent: item.remise_percent,
	tva_tx: item.tva_tx,
	qty: item.qty,
})
