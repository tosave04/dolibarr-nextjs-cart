"use server"

import crypto from "crypto"

const SECRET_KEY = String(process.env.SECRET)

/**
 * Generates a hash based on a given string, the current date, and a secret key.
 *
 * This function creates a SHA-256 hash by concatenating the provided string (`chaine`),
 * the current date in `YYYY_MM_DD` format, and a secret key. It then encodes the hash in
 * base64, removes certain characters (i.e., '+', '/', and '='), and truncates the result
 * to a specified number of digits. The final hash is converted to uppercase.
 *
 * @param {string} chaine - The input string to be hashed.
 * @param {number} [digits=10] - The number of characters to include in the final hash.
 * @param {string} [secret=SECRET_KEY] - The secret key used for hashing. Defaults to `SECRET_KEY`.
 * @returns {string} The generated hash, truncated to the specified number of digits and in uppercase.
 */
export function hashFonction(chaine: string, digits: number = 10, secret: string = SECRET_KEY) {
	const currentDate = new Date()

	const year = currentDate.getFullYear()
	const month = ("0" + (currentDate.getMonth() + 1)).slice(-2)
	const day = ("0" + currentDate.getDate()).slice(-2)

	const date_yyyy_mm_dd = `${year}_${month}_${day}`

	return crypto
		.createHash("sha256")
		.update(chaine + date_yyyy_mm_dd + secret)
		.digest("base64")
		.replace(/[+/=]/g, "")
		.slice(0, digits)
		.toUpperCase()
}
