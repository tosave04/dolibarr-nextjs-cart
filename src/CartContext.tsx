"use client"

import { createContext, useContext, useState } from "react"
import { countCart } from "./utils/countCart"
import { deepCopyFunction } from "@tosave04/tosave-utils-ts"
import type { Cart } from "./types/CartInterface"
import type { Item } from "./types/ItemInterface"

const DEFAULT_CART = { items: [], ...countCart([]) } as Cart
const USE_LOCAL_STORAGE = false
const USE_SESSION_STORAGE = false

/**
 * The CartContext provides a way to manage the shopping cart state and operations.
 */
export const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * CartProvider component that wraps the application and provides the cart context.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The children components that will have access to the context.
 * @returns {JSX.Element} The provider component that wraps its children with AuthContext.
 */
export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [cart, setCart] = useState<Cart>(DEFAULT_CART)

	/**
	 * Adds one or more items to the cart.
	 */
	const addItems = (items?: Item | Item[]) => {
		const newCart = deepCopyFunction(cart.items)

		if (Array.isArray(items)) {
			if (items.length === 0) return false
			else for (const item of items) newCart.push(item)
		} else {
			if (!items) return false
			else newCart.push(items)
		}

		return update(newCart)
	}

	/**
	 * Updates the cart with a new list of items.
	 */
	const update = (items: Item[]) => {
		try {
			const totals = countCart(items)
			const newCart = { items, ...totals }

			save(newCart)
			setCart(newCart)

			return true
		} catch (e) {
			return false
		}
	}

	/**
	 * Changes the quantity of a specific item in the cart.
	 */
	const updateItem = (index: number, qty: number) => {
		const newCart = deepCopyFunction(cart.items)

		newCart[index].qty = qty

		if (qty === 0) {
			return deleteItem(index)
		}

		return update(newCart)
	}

	/**
	 * Searches for an item in the cart based on specified criteria.
	 */
	const searchItem = (search: { fk_product?: number; keyCode?: string; label?: string }) => {
		if (!Object.keys(search).length) return -1

		return cart.items.findIndex((item) => {
			if (search?.fk_product && item?.fk_product !== search.fk_product) return false
			if (search?.keyCode && !item?.keyCode?.includes(search.keyCode)) return false
			if (search?.label && !item?.label?.includes(search.label)) return false
			return true
		})
	}

	/**
	 * Deletes an item from the cart based on its index.
	 */
	const deleteItem = (index: number) => {
		const newCartItems = deepCopyFunction(cart.items)

		newCartItems.splice(index, 1)

		return update(newCartItems)
	}

	/**
	 * Saves the current cart to local storage or session storage
	 */
	const save = (cart: Cart) => {
		try {
			USE_LOCAL_STORAGE && localStorage.setItem("cart", JSON.stringify(cart))
			USE_SESSION_STORAGE && sessionStorage.setItem("cart", JSON.stringify(cart))
			return true
		} catch (e) {
			return false
		}
	}

	/**
	 * Loads the cart from local storage or session storage
	 */
	const load = () => {
		try {
			const localJsonCart = USE_LOCAL_STORAGE ? localStorage.getItem("cart") : null
			const sessionJsonCart = USE_SESSION_STORAGE ? sessionStorage.getItem("cart") : null

			const cart = localJsonCart
				? (JSON.parse(localJsonCart) as Cart)
				: sessionJsonCart
				? (JSON.parse(sessionJsonCart) as Cart)
				: DEFAULT_CART

			setCart(cart)
			return true
		} catch (e) {
			return false
		}
	}

	/**
	 * Resets the cart to its default state.
	 */
	const reset = ({
		withConfirm = true,
		handleConfirm = () => window.confirm("Do you really want to clear the cart?"),
	}: {
		withConfirm?: boolean
		handleConfirm?: () => boolean
	}) => {
		if (withConfirm && !handleConfirm) return false

		USE_LOCAL_STORAGE && localStorage.removeItem("cart")
		USE_SESSION_STORAGE && sessionStorage.removeItem("cart")

		setCart(DEFAULT_CART)

		return true
	}

	const isEmpty = !cart?.items?.length

	return (
		<CartContext.Provider
			value={{
				cart,
				addItems,
				update,
				updateItem,
				searchItem,
				deleteItem,
				save,
				load,
				reset,
				isEmpty,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export interface CartContextType {
	/**
	 * The current cart object.
	 */
	cart: Cart

	/**
	 * Adds one or more items to the cart.
	 * If the input is an array of items, each item is added to the cart.
	 * If the input is a single item, it is added to the cart.
	 * If no item is provided, the function returns false.
	 * After updating the cart with the new items, it saves the cart and updates the state.
	 *
	 * @param items - The item or array of items to be added to the cart.
	 * @returns A boolean indicating whether the cart was successfully updated.
	 */
	addItems: (items?: Item | Item[]) => boolean

	/**
	 * Updates the cart with a new list of items.
	 * Calculates the total quantities and prices based on the updated list of items.
	 * Saves the updated cart and updates the state.
	 *
	 * @param items - The updated list of items to be saved in the cart.
	 * @returns A boolean indicating whether the cart was successfully updated.
	 */
	update: (items: Item[]) => boolean

	/**
	 * Changes the quantity of a specific item in the cart.
	 * If the quantity is set to zero, the item is removed from the cart.
	 * After updating the quantity, it updates the cart state.
	 *
	 * @param index - The index of the item in the cart whose quantity is to be changed.
	 * @param qty - The new quantity for the item.
	 * @returns A boolean indicating whether the cart was successfully updated.
	 */
	updateItem: (index: number, qty: number) => boolean

	/**
	 * Searches for an item in the cart based on specified criteria.
	 * The search can be based on product ID, key code, or label.
	 * Returns the index of the first item that matches the search criteria, or -1 if no match is found.
	 *
	 * @param search - An object containing the search criteria (product ID, key code, or label).
	 * @returns The index of the matching item in the cart, or -1 if no match is found.
	 */
	searchItem: (search: { fk_product?: number; keyCode?: string; label?: string }) => number

	/**
	 * Deletes an item from the cart based on its index.
	 * After removing the item, it updates the cart state.
	 *
	 * @param index - The index of the item in the cart to be deleted.
	 * @returns A boolean indicating whether the cart was successfully updated.
	 */
	deleteItem: (index: number) => boolean

	/**
	 * Saves the current cart to local storage or session storage if enabled.
	 *
	 * @param cart - The cart object to be saved.
	 * @returns A boolean indicating whether the cart was successfully saved.
	 */
	save: (cart: Cart) => boolean

	/**
	 * Loads the cart from local storage or session storage if available.
	 * If no cart is found in storage, the default cart is loaded.
	 *
	 * @returns A boolean indicating whether the cart was successfully loaded.
	 */
	load: () => boolean

	/**
	 * Resets the cart to its default state.
	 * Optionally confirms the action with the user before resetting.
	 * Removes the cart from local storage and session storage if enabled.
	 *
	 * @param withConfirm - A boolean indicating whether to ask for confirmation before resetting.
	 * @param handleConfirm - A function that handles the confirmation prompt.
	 * @returns A boolean indicating whether the cart was successfully reset.
	 */
	reset: ({ withConfirm, handleConfirm }: { withConfirm?: boolean; handleConfirm?: () => boolean }) => boolean

	/**
	 * A boolean indicating whether the cart is empty.
	 */
	isEmpty: boolean
}

/**
 * Custom hook to access the cart context.
 *
 * Must be used within a CartProvider component.
 *
 * @returns The cart context object.
 */
export const useCart = () => useContext(CartContext)
