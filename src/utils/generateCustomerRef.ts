"use server"

import { hashFonction } from "./hashFonction"
import type { Cart } from "../types/CartInterface"

export const generateCustomerRef = (thirdparty: any, cart: Cart, length: number = 6): string => {
	const customer_ref = hashFonction(
		thirdparty.code_client + JSON.stringify({ ...cart, items: undefined }) + Date.now(),
		length
	)

	return customer_ref
}
