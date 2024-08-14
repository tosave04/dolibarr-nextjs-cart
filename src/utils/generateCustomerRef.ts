"use server"

import { hashFonction } from "./hashFonction"
import type { Cart } from "../types/CartInterface"

/**
 * Generates a unique customer reference based on a third-party client code, cart details, and the current timestamp.
 *
 * This function creates a customer reference code by hashing a combination of the third-party client code,
 * a JSON representation of the cart object (excluding the items), and the current timestamp. The generated
 * hash is then truncated to the specified length to ensure the reference code is of the desired size.
 *
 * @param {any} thirdparty - An object containing third-party information, including a `code_client` property.
 * @param {Cart} cart - The cart object containing details about the customer's cart. The `items` property is excluded from hashing.
 * @param {number} [length=6] - The length of the resulting reference code. Defaults to 6.
 *
 * @returns {string} The generated unique customer reference code.
 */
export const generateCustomerRef = (thirdparty: any, cart: Cart, length: number = 6): string => {
	const customer_ref = hashFonction(
		thirdparty.code_client + JSON.stringify({ ...cart, items: undefined }) + Date.now(),
		length
	)

	return customer_ref
}
