import { Line } from "@tosave04/dolibarr-utils-ts"
import { Cart, Item } from "../types"
import { convertItem2Line } from "./convertItem2Line"

export const convertCart4Dolibarr = async (
	cart: Cart,
	doSomething: (props: { line: Line; item?: Item }) => Promise<Line> = async ({ line }) => line
): Promise<{ lines: Line[] }> => {
	const items = cart.items
	const lines = []

	for await (const iterator of items.map(async (item, id) => {
		const line = convertItem2Line(item)

		const modifiedLine = await doSomething({ line, item })

		return modifiedLine
	}))
		lines.push(iterator)

	// TODO: Other information to be added to the cart
	return { lines: [] }
}
