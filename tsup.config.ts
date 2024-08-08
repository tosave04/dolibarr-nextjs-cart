import { defineConfig } from "tsup"

export default defineConfig({
	entry: {
		index: "src/index.tsx",
		test: "src/test.tsx",
	},
	outDir: "dist",
	format: ["cjs", "esm"],
	target: "es6",
	sourcemap: true,
	minify: true,
	splitting: false,
	clean: true,
	dts: true,
	external: ["react", "react-dom"],
})
