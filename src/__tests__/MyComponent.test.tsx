import React from "react"
import { render, screen } from "@testing-library/react"
import { MyComponent } from "../index"

test("renders component correctly", () => {
	render(<MyComponent />)
	expect(screen.getByText("Hello, this is my React component!")).toBeInTheDocument()
})
