"use server"

import { hashFonction } from "./hashFonction"
import type { Item } from "../types/ItemInterface"

/**
 * Generates a verification code for item integrity.
 *
 * This function creates a hash to verify the integrity of an item by using its relevant properties.
 * The function takes an object with specific properties of an `Item` and creates a JSON string representation
 * of this object. This JSON string is then hashed using the `hashFonction` to produce a unique key code.
 * This key code can be used to verify that the item data has not been tampered with.
 *
 * @param {Pick<Item, "data" | "price" | "fk_product" | "label" | "desc" | "subprice" | "remise_percent" | "tva_tx">} params
 * The properties of the `Item` to be included in the integrity check. The properties are:
 *   - `data`: General data associated with the item.
 *   - `price`: Price of the item.
 *   - `fk_product`: Foreign key referencing the product.
 *   - `label`: Label or name of the item.
 *   - `desc`: Description of the item.
 *   - `subprice`: Sub-price associated with the item.
 *   - `remise_percent`: Discount percentage applied to the item.
 *   - `tva_tx`: VAT rate applied to the item.
 *
 * @returns {string} The generated key code for item integrity verification.
 */
export const generateKeyCode = (
	params: Pick<Item, "data" | "price" | "fk_product" | "label" | "desc" | "subprice" | "remise_percent" | "tva_tx">
) => {
	const { data, price, fk_product, label, desc, subprice, remise_percent, tva_tx } = params
	const key = { data, price, fk_product, label, desc, subprice, remise_percent, tva_tx }

	const hash = hashFonction(JSON.stringify(key))

	return hash
}
