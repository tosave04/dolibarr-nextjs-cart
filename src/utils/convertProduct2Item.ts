"use server"

import { generateKeyCode } from "./generateKeyCode"
import type { Product } from "@tosave04/dolibarr-utils-ts"
import type { Item } from "../types"

// Default validity period in days, using environment variable or defaulting to 365 days
const VALIDITY = Number(process.env.VALIDITE_ARTICLES ?? 365)

/**
 * Converts a `Product` from Dolibarr to an `Item` suitable for use in a cart.
 *
 * This function transforms a Dolibarr `Product` object into a cart `Item` by mapping relevant product attributes
 * and applying various transformations and calculations. It also generates a unique `keyCode` for the item.
 *
 * The conversion process involves the following steps:
 *
 * 1. **Type Determination**: Sets the `type` of the item, defaulting to "accessoire" unless `force_type` is provided.
 * 2. **Product Type**: Converts the product's type to a string ("1" for type 1, otherwise "0").
 * 3. **Price Calculation**:
 *    - Extracts multiprices from the product and finds the price corresponding to the given `price_level`.
 *    - If no specific price is found, falls back to the product's default price.
 * 4. **Date and Validity Calculation**:
 *    - Sets the `date` to the current timestamp.
 *    - Calculates `validity` by adding the validity period (in days) to the current date.
 * 5. **Item Attributes**:
 *    - Extracts product `label`, `description`, `id` (as `fk_product`), and `tva_tx` (VAT rate).
 *    - Calculates `subprice`, the price adjusted for the discount.
 * 6. **Generate Key Code**: Assigns a unique `keyCode` to the item by calling `generateKeyCode`.
 *
 * The final `Item` object includes all the relevant attributes needed for a cart and includes calculations for pricing
 * and validity based on the Dolibarr `Product`.
 *
 * @param {Object} params - The parameters for the conversion function.
 * @param {Product} params.product - The Dolibarr `Product` to be converted.
 * @param {number} [params.quantity=1] - The quantity of the item.
 * @param {number} [params.remise_percent=0] - The discount percentage to apply.
 * @param {number} [params.price_level] - The price level to use for pricing.
 * @param {string} [params.force_type] - An optional type override for the item.
 * @param {number} [params.validity=VALIDITY] - The validity period in days.
 * @returns {Item} - The resulting cart `Item` with transformed and calculated attributes.
 */
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
