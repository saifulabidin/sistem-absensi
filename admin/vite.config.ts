import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: './',
	root: './src',
	server: {
		cors: {
			// the origin you will be accessing via browser
			origin: 'http://localhost:5000',
		},
		open: true,
		port: 3111,
	},
	build: {
		// generate .vite/manifest.json in outDir
		manifest: true,
		outDir: '../public',
		emptyOutDir: true,
	},
})