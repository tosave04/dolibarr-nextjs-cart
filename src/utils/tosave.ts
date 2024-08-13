/**
 * @author Thomas Savournin <tosave.vbl@gmail.com>
 */

// Shadow optimized copy of a multi-dimensional object or array
export const deepCopyFunction = <T>(inObject: T) => {
	let outObject: any, value: any, key: keyof T

	if (typeof inObject !== "object" || inObject === null) {
		return inObject // Return the value if inObject is not an object
	}

	// Create an array or object to hold the values
	outObject = Array.isArray(inObject) ? [] : {}

	for (key in inObject) {
		value = inObject[key]

		// Recursively (deep) copy for nested objects, including arrays
		outObject[key] = deepCopyFunction(value)
	}

	return outObject as T
}

// Convert a number to french currency
export const convertToMoney = (number?: number) => {
	if (!number && number !== 0) return "... €"
	return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(number)
}

// Convert a timestamp to a french date with Intl
export const convertToDate = (timestamp?: number, year2digit?: boolean) => {
	if (!timestamp) return "..."

	// If the timestamp is in seconds (ex: php), convert it to milliseconds (js)
	if (timestamp < 10000000000) timestamp *= 1000

	return new Intl.DateTimeFormat("fr-FR", {
		year: year2digit ? "2-digit" : "numeric",
		month: "numeric",
		day: "numeric",
	}).format(new Date(timestamp))
}

// Check if an email is valid
export const validateEmail = (email: string) => {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	return regex.test(email)
}

// Return a random array of the quantity asked from an array
export const randomArray = (array: any[], quantity: number) => {
	const newArray: any[] = []

	// On vérifie que la quantité demandée n'est pas supérieure à la taille de l'array
	const arrayLength = array.length
	const maxQuantity = arrayLength > quantity ? quantity : arrayLength

	for (let i = 0; i < maxQuantity; i++) {
		const random = Math.floor(Math.random() * array.length)
		const randomElement = array[random]

		// On supprime l'élément de l'array pour ne pas le repiocher
		array.splice(random, 1)

		newArray.push(randomElement)
	}

	return newArray
}

// Encode a string UTF-8 to base64
export const b64EncodeUnicode = (str: string) =>
	btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
			return String.fromCharCode(parseInt(p1, 16))
		})
	)

// Decode a base64 string to UTF-8
export const b64DecodeUnicode = (str: string) =>
	decodeURIComponent(
		Array.prototype.map
			.call(atob(str), function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join("")
	)

// Convert a phone number to E164 format
export const convertPhoneToE164 = (phone: string, defaultCountryCode: number = 33) => {
	// On enlève les espaces
	const phoneString = phone.trim()

	// On vérifie si le numéro a déjà un indicatif pays
	const haveCountryCode = phoneString.match(/(\+|\()/)

	// On enlève les caractères non numériques
	const numericOnly = phone.replace(/\D/g, "")

	// On formatte en E164 avec le +
	if (haveCountryCode) {
		const countryCode = numericOnly.slice(0, 2)
		const phonePart = numericOnly.slice(2).replace(/^0/, "")
		return `+${countryCode}${phonePart}`
	} else {
		const phonePart = numericOnly.replace(/^0/, "")
		return `+${String(defaultCountryCode)}${phonePart}`
	}
}

// Convert a timestamp to a formatted date and time (yyyy-mm-dd hh:mm:ss by default)
export const convertTimestampToDateTime = ({
	timestamp,
	format = "long",
	dateSeparator = "-",
	timeSeparator = ":",
}: {
	timestamp: number
	format?: "short" | "long"
	dateSeparator?: string
	timeSeparator?: string
}) => {
	const correctTimestamp = timestamp.toString().length > 10 ? timestamp : timestamp * 1000

	const date = new Date(correctTimestamp)

	const year = String(date.getFullYear())
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")
	const seconds = String(date.getSeconds()).padStart(2, "0")

	const formatedDate = [year, month, day].join(dateSeparator)
	const formatedTime = [hours, minutes, seconds].join(timeSeparator)

	return format === "short" ? formatedDate : `${formatedDate} ${formatedTime}`
}

// On sépare le nom et le prénom d'une chaîne de caractères
export const retrieveFirstLastNameFromString = (fullName: string) => {
	// Diviser la chaîne en mots
	const mots = fullName.split(" ")

	// Déterminer la longueur de la chaîne
	const longueur = mots.length

	// Initialiser les variables pour le nom et le prénom
	let surname = "" // nom de famille
	let given_name = "" // prénom

	// Vérifier l'ordre possible du nom et du prénom
	if (longueur === 1) {
		// Un seul mot, considérer cela comme le prénom
		given_name = mots[0]
	} else if (longueur === 2) {
		// Deux mots, essayer de deviner l'ordre
		if (mots[0].length > mots[1].length) {
			surname = mots[0]
			given_name = mots[1]
		} else {
			surname = mots[1]
			given_name = mots[0]
		}
	} else {
		// Trois mots ou plus, supposer que le dernier est le nom
		surname = mots[longueur - 1]
		// Les mots restants sont le prénom
		given_name = mots.slice(0, longueur - 1).join(" ")
	}

	// Retourner les résultats
	return { surname, given_name }
}

// Normalisation en a-A0-9
export const replaceSpecialChars = (str: string) =>
	str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\x00-\x7F]/g, "")
		.replace(/[^a-zA-Z0-9\s]/g, "")

// Calculs sur les objets : somme
export const objectKeySum = (data: Record<string, any>[], key: string) =>
	deepCopyFunction(data).reduce((acc, curr) => (Number.isNaN(Number(curr?.[key])) ? acc : acc + Number(curr[key])), 0)

// Calculs sur les objets : moyenne
export const objectKeyAverage = (data: Record<string, any>[], key: string) =>
	objectKeySum(data, key) / Math.max(data.filter((line) => Number(line?.[key]) > 0).length, 1)

// Calculs sur les objets : maximum
export const objectKeyMax = (data: Record<string, any>[], key: string) =>
	deepCopyFunction(data).reduce((acc, curr) => Math.max(acc, Number(curr?.[key])), 0)

// Calculs sur les objets : minimum
export const objectKeyMin = (data: Record<string, any>[], key: string) =>
	deepCopyFunction(data).reduce((acc, curr) => Math.min(acc, Number(curr?.[key])), 0)
