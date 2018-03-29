// @flow
import { isBrowser } from '@emotion/utils'
import * as React from 'react'
import type { CSSContextType } from '@emotion/types'
import createCache from '@emotion/cache'

type RenderFn<T> = (value: T) => React.Node

export type ProviderProps<T> = {
  value: T,
  children?: React.Node
}

export type ConsumerProps<T> = {
  children: RenderFn<T> | [RenderFn<T>]
}

export type ConsumerState<T> = {
  value: T
}

export type Provider<T> = React.Component<ProviderProps<T>>
export type Consumer<T> = React.Component<ConsumerProps<T>, ConsumerState<T>>

export type Context<T> = {
  Provider: Class<Provider<T>>,
  Consumer: Class<Consumer<T>>
}

export let hydration = { shouldHydrate: false }

if (isBrowser) {
  hydration.shouldHydrate = !!document.querySelector('[data-more]')
}

if (process.env.NODE_ENV === 'test' || !isBrowser) {
  // $FlowFixMe
  Object.defineProperty(hydration, 'shouldHydrate', {
    set: () => {},
    get: () => true
  })
}

// $FlowFixMe
export const CSSContext: Context<CSSContextType> = React.createContext(null)

let defaultCache

export function consumer(
  instance: { emotionCache?: CSSContextType },
  func: CSSContextType => React.Node
) {
  return (
    <CSSContext.Consumer>
      {context => {
        if (context === null) {
          if (isBrowser && process.env.NODE_ENV !== 'test') {
            if (defaultCache === undefined) {
              defaultCache = createCache()
            }
            return func(defaultCache)
          }
          if (instance.emotionCache === undefined) {
            instance.emotionCache = createCache()
          }
          return (
            <CSSContext.Provider value={instance.emotionCache}>
              {func(instance.emotionCache)}
            </CSSContext.Provider>
          )
        } else {
          return func(context)
        }
      }}
    </CSSContext.Consumer>
  )
}
