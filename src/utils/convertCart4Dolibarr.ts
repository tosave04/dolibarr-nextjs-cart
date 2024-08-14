import { convertItem2Line } from "./convertItem2Line"
import type { Line } from "@tosave04/dolibarr-utils-ts"
import type { Cart, Item } from "../types"

/**
 * Converts a shopping cart into a list of lines for Dolibarr, applying an optional transformation function to each line.
 *
 * @param {Cart} cart - The shopping cart containing items to be converted.
 * @param {(props: { line: Line; item?: Item }) => Promise<Line>} [doSomething] - An optional function to transform each line. If not provided, lines will not be transformed.
 * @returns {Promise<{ lines: Line[] }>} - A promise that resolves to an object containing the list of lines.
 *
 * @throws {Error} - An error is thrown if an error occurs during the conversion process.
 *
 * @example
 * const items: Cart["items"] = [
 * 	{ type: "", label: "Item 1", qty: 2, price: 10, product_type: "0", subprice: 0, tva_tx: 0 },
 * 	{ type: "", label: "Item 2", qty: 2, price: 10, product_type: "0", subprice: 0, tva_tx: 0 },
 * ]
 *
 * const cart: Cart = { items, ...countCart(items) }
 *
 * const customTransformFunction = async ({ line, item }: { line: Line; item?: Item }): Promise<Line> => {
 * 	// Do something with the line : adding or modifying information
 * 	return line
 * }
 *
 * convertCart4Dolibarr(cart, customTransformFunction).then((result) => {
 * 	// Do something with the result
 * })
 */
export const convertCart4Dolibarr = async (
	cart: Cart,
	doSomething?: (props: { line: Line; item?: Item }) => Promise<Line>
): Promise<{ lines: Line[] }> => {
	try {
		const items = cart.items
		const lines = []

		for await (const iterator of items.map(async (item, id) => {
			const line = convertItem2Line(item)

			const modifiedLine = !doSomething ? line : await doSomething({ line, item })

			return modifiedLine
		}))
			lines.push(iterator)

		return { lines: [] }
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "An error has occurred")
	}
}
