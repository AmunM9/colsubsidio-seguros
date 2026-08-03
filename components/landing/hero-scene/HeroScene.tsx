import Image from 'next/image'

const ASSETS = {
  casaIzquierda: '/lemonade-hero/home-left.svg',
  casaDerecha: '/lemonade-hero/home-right.svg',
  detalle: '/lemonade-hero/cat-detail.svg',
  carro: '/lemonade-hero/car.svg',
  persona: '/lemonade-hero/person.svg',
} as const

export function HeroScene() {
  return (
    <div className="lemonade-scene" aria-hidden="true">
      <div className="lemonade-scene__nubes" />
      <div className="lemonade-scene__imagenes">
        <div className="lemonade-scene__columna lemonade-scene__columna--izquierda">
          <Image
            unoptimized
            className="lemonade-scene__casa-izquierda"
            src={ASSETS.casaIzquierda}
            alt=""
            width={616}
            height={472}
          />
          <Image
            unoptimized
            className="lemonade-scene__detalle"
            src={ASSETS.detalle}
            alt=""
            width={389}
            height={238}
          />
          <Image
            unoptimized
            className="lemonade-scene__carro"
            src={ASSETS.carro}
            alt=""
            width={680}
            height={245}
          />
        </div>
        <div className="lemonade-scene__centro" />
        <div className="lemonade-scene__columna lemonade-scene__columna--derecha">
          <Image
            unoptimized
            preload
            className="lemonade-scene__casa-derecha"
            src={ASSETS.casaDerecha}
            alt=""
            width={616}
            height={472}
          />
          <Image
            unoptimized
            preload
            className="lemonade-scene__persona"
            src={ASSETS.persona}
            alt=""
            width={778}
            height={475}
          />
        </div>
      </div>
    </div>
  )
}
