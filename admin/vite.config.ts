import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	root: './src',
	build: {
		outDir: '../public',
		emptyOutDir: true,
	},
	server: {
		open: true,
		port: 3111,
	},
	plugins: [react()],
})
