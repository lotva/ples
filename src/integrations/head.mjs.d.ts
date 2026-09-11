export declare const script: string
export declare const awaitScript: string
export declare const navigationScript: string
export declare const style: string
export declare const effects: Record<
  'relax' | 'zoom' | 'screw' | 'focus',
  string
>
export declare const scroll: string
export declare const sequence: string
export declare const awaitStyle: string
export declare const navigationStyle: string

export type PlesCspOptions = {
  effects?: readonly ('relax' | 'zoom' | 'screw' | 'focus')[]
  scroll?: boolean
  sequence?: boolean
  await?: boolean
  navigation?: boolean
}

export declare function csp(options?: PlesCspOptions): {
  scriptSrc: string[]
  styleSrc: string[]
}
