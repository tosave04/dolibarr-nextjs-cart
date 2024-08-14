"use server"

import crypto from "crypto"

const SECRET_KEY = String(process.env.SECRET)

// Création d'un hash en fonction d'une chaine, de la date du jour et d'un salt
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
