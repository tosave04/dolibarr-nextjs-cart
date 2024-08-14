import { deepCopyFunction } from "@tosave04/tosave-utils-ts"
import type { Line } from "@tosave04/dolibarr-utils-ts"
import type { Item } from "../types"

/**
 * Converts an `Item` to a `Line` format suitable for Dolibarr.
 *
 * This function performs the following steps:
 * 1. **Deep Copy**: Creates a deep copy of the input `Item` to avoid modifying the original object.
 *    - Uses `deepCopyFunction` from the `@tosave04/tosave-utils-ts` module to ensure that nested objects
 *      are also copied.
 * 2. **Field Removal**: Removes specific fields from the copied `Item` object that are not needed or
 *    relevant for Dolibarr. This includes:
 *    - `type`: Presumably a field that indicates the type of the item, which is not needed in the `Line` format.
 *    - `date`: Date information, which may not be relevant in the context of Dolibarr lines.
 *    - `validite`: Validity field, which is removed to conform to Dolibarr's expected format.
 *    - `keyCode`: A key code field, which is not necessary for the `Line`.
 *    - `data`: Any additional data that is not required.
 *    - `price`: Price field, possibly because it is handled differently in Dolibarr or is calculated elsewhere.
 *
 * The final result is a `Line` object that contains only the fields relevant to Dolibarr, ensuring
 * compatibility with its data model.
 *
 * @param {Item} item - The `Item` object to be converted into a `Line`.
 * @returns {Line} - The resulting `Line` object, with unnecessary fields removed.
 */
export const convertItem2Line = (item: Item): Line => {
	const line: Line = deepCopyFunction(item)

	// Remove unnecessary fields for Dolibarr
	delete line.type
	delete line.date
	delete line.validite
	delete line.keyCode
	delete line.data
	delete line.price

	return line
}
