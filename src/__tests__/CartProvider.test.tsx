import { act, renderHook } from "@testing-library/react"
import { CartProvider, useCart } from "../index"
import type { CartContextType, Item } from "../index"

describe("CartProvider", () => {
	let wrapper: React.FC
	let result: { current: CartContextType | undefined }

	beforeEach(() => {
		wrapper = ({ children }: any) => <CartProvider>{children}</CartProvider>

		const render = renderHook(() => useCart(), { wrapper })
		result = render.result

		const item: Item = { type: "test", price: 100, product_type: "0", subprice: 100, tva_tx: 20, qty: 1 }
		act(() => result.current?.addItems(item))
	})

	it("should initialize with an empty cart", () => {
		act(() => result.current?.update([]))
		expect(result.current?.cart.articles).toEqual([])
		expect(result.current?.isEmpty).toBe(true)
	})

	it("should add an item to the cart", () => {
		expect(result.current?.cart.articles).toHaveLength(1)
		expect(result.current?.isEmpty).toBe(false)
	})

	it("should update the quantity of an item in the cart", () => {
		act(() => result.current?.updateItem(0, 5))
		expect(result.current?.cart.articles[0].qty).toBe(5)
	})

	it("should remove an item from the cart if quantity is set to zero", () => {
		act(() => result.current?.updateItem(0, 0))
		expect(result.current?.cart.articles).toHaveLength(0)
		expect(result.current?.isEmpty).toBe(true)
	})

	it("should delete an item from the cart", () => {
		act(() => result.current?.deleteItem(0))
		expect(result.current?.cart.articles).toHaveLength(0)
		expect(result.current?.isEmpty).toBe(true)
	})

	it("should save and load the cart from localStorage", () => {
		act(() => {
			result.current?.save(result.current.cart)
			result.current?.load()
		})
		expect(result.current?.cart.articles).toHaveLength(0)
	})

	it("should reset the cart to its default state", () => {
		act(() => result.current?.reset({ withConfirm: false }))
		expect(result.current?.cart.articles).toHaveLength(0)
		expect(result.current?.isEmpty).toBe(true)
	})
})
