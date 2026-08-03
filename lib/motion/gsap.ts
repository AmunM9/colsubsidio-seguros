'use client'

import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/** Tokens de movimiento. Se definen UNA vez. Cero duraciones sueltas en componentes. */

let listo = false
export const initGsap = () => {
  if (listo || typeof window === 'undefined') return
  listo = true
  gsap.registerPlugin(CustomEase, DrawSVGPlugin, Flip, ScrollTrigger, SplitText)
  CustomEase.create('soft', 'M0,0 C0.22,1 0.36,1 1,1')
  CustomEase.create('crisp', 'M0,0 C0.65,0 0.35,1 1,1')
  CustomEase.create('lift', 'M0,0 C0.34,1.3 0.64,1 1,1')
}

export const D = { micro: 0.2, base: 0.45, hero: 0.8 } as const
export const STAGGER = 0.06

export const sinMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, Flip, ScrollTrigger, SplitText }
