import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
  assetsInclude: ['**/*.glb']
=======
  assetsInclude: ['**/*.glb', '**/*.hdr']
>>>>>>> Stashed changes
})

