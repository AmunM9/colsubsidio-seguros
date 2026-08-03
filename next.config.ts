import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * StrictMode desmonta y remonta cada componente en desarrollo. El ConversationProvider
   * de ElevenLabs cierra la sesión al desmontar, así que la conversación se caía apenas
   * conectaba — solo en dev. Se apaga para que la demo se pueda probar en local.
   * En producción StrictMode no hace doble montaje, así que esto no cambia el build.
   */
  reactStrictMode: false,
}

export default nextConfig
