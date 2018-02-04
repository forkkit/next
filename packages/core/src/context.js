// @flow
import * as React from 'react'
import type { CSSContextType } from './types'
import StyleSheet from './sheet'
import { isBrowser } from './utils'
import { Stylis, hashString } from 'emotion-utils'
import stylisRuleSheet from 'stylis-rule-sheet'
import { type Context } from 'create-react-context'

const defaultContext: CSSContextType = {
  stylis: new Stylis({
    keyframe: false,
    global: false,
    semicolon: true
  }),
  sheet: new StyleSheet({ key: '' }),
  inserted: {},
  registered: {},
  theme: {}
}

if (isBrowser) {
  defaultContext.sheet.inject()
}

let current

let sheetToInsert

const insertionPlugin = stylisRuleSheet(function(rule: string) {
  current.push(rule)
})

const returnFullPlugin = function(context) {
  if (context === -1) {
    current = []
  }
  if (context === -2) {
    return current
  }
}

defaultContext.stylis.use(insertionPlugin)(returnFullPlugin)

// $FlowFixMe
export const CSSContext: Context<CSSContextType> = React.createContext(
  defaultContext
)