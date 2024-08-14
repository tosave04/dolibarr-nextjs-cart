"use server"

import { generateKeyCode } from "./generateKeyCode"
import type { Item } from "../types"
import type { Product } from "@tosave04/dolibarr-utils-ts"

const VALIDITY = Number(process.env.VALIDITE_ARTICLES ?? 365)

export const convertProduct2Item = ({
	product,
	quantity = 1,
	remise_percent = 0,
	price_level,
	force_type,
	validity = VALIDITY,
}: {
	product: Product
	quantity: number
	remise_percent: number
	price_level?: number
	force_type?: string
	validity?: number
}): Item => {
	// TODO: Rename type to other name
	const type = force_type ?? "accessoire"

	const product_type = Number(product?.type) === 1 ? "1" : "0"

	const multiprices = Object.entries(product?.multiprices ?? {})

	// TODO: Check price verification
	const price = Number(multiprices.find((price) => price[0] === String(price_level))?.[1] ?? product?.price ?? 0)

	const date = Date.now()
	const validite = date + validity * 24 * 60 * 60 * 1000
	const label = String(product?.label)
	const desc = String(product?.description)
	const fk_product = Number(product?.id)
	const subprice = Math.round((price / (1 - remise_percent / 100)) * 100) / 100
	const tva_tx = Number(product.tva_tx)

	const article: Item = {
		type,
		date,
		validite,
		keyCode: undefined,
		product_type,
		label,
		desc,
		fk_product,
		price,
		subprice,
		remise_percent,
		tva_tx,
		qty: quantity,
	}

	article.keyCode = generateKeyCode(article)

	return article
}
