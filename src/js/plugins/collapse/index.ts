/*
 * HSCollapse
 * @version: 2.4.1
 * @author: Preline Labs Ltd.
 * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
 * Copyright 2024 Preline Labs Ltd.
 */

import { dispatch, afterTransition } from '../../utils'

import { ICollapse } from './interfaces'

import HSBasePlugin from '../base-plugin'
import { ICollectionItem } from '../../interfaces'

class HSCollapse extends HSBasePlugin<{}> implements ICollapse {
  private readonly contentId: string | null
  public content: HTMLElement | null
  private animationInProcess: boolean

  constructor(el: HTMLElement, options?: {}, events?: {}) {
    super(el, options, events)

    this.contentId = this.el.dataset.collapse
    this.content = document.querySelector(this.contentId)
    this.animationInProcess = false

    if (this.content) this.init()
  }

  private init() {
    this.createCollection(window.$hsCollapseCollection, this)

    if (this?.el?.ariaExpanded) {
      if (this.el.classList.contains('open')) this.el.ariaExpanded = 'true'
      else this.el.ariaExpanded = 'false'
    }

    this.el.addEventListener('click', () => {
      if (this.content.classList.contains('open')) {
        this.hide()
      } else {
        this.show()
      }
    })
  }

  private hideAllMegaMenuItems() {
    this.content.querySelectorAll('mega-menu-content.block').forEach(el => {
      el.classList.remove('block')
      el.classList.add('hidden')
    })
  }

  // Public methods
  public show() {
    if (this.animationInProcess || this.el.classList.contains('open')) return false

    this.animationInProcess = true

    this.el.classList.add('open')
    if (this?.el?.ariaExpanded) this.el.ariaExpanded = 'true'
    this.content.classList.add('open')
    this.content.classList.remove('hidden')

    this.content.style.height = '0'
    setTimeout(() => {
      this.content.style.height = `${this.content.scrollHeight}px`

      this.fireEvent('beforeOpen', this.el)
      dispatch('beforeOpen.collapse', this.el, this.el)
    })

    afterTransition(this.content, () => {
      this.content.style.height = ''

      this.fireEvent('open', this.el)
      dispatch('open.collapse', this.el, this.el)

      this.animationInProcess = false
    })
  }

  public hide() {
    if (this.animationInProcess || !this.el.classList.contains('open')) return false

    this.animationInProcess = true

    this.el.classList.remove('open')
    if (this?.el?.ariaExpanded) this.el.ariaExpanded = 'false'

    this.content.style.height = `${this.content.scrollHeight}px`
    setTimeout(() => {
      this.content.style.height = '0'
    })

    this.content.classList.remove('open')

    afterTransition(this.content, () => {
      this.content.classList.add('hidden')
      this.content.style.height = ''

      this.fireEvent('hide', this.el)
      dispatch('hide.collapse', this.el, this.el)

      this.animationInProcess = false
    })

    if (this.content.querySelectorAll('.mega-menu-content.block').length) {
      this.hideAllMegaMenuItems()
    }
  }

  // Static methods
  static getInstance(target: HTMLElement, isInstance = false) {
    const elInCollection = window.$hsCollapseCollection.find(
      el => el.element.el === (typeof target === 'string' ? document.querySelector(target) : target)
    )

    return elInCollection ? (isInstance ? elInCollection : elInCollection.element.el) : null
  }

  static autoInit() {
    if (!window.$hsCollapseCollection) window.$hsCollapseCollection = []

    document.querySelectorAll('.collapse-toggle:not(.--prevent-on-load-init)').forEach((el: HTMLElement) => {
      if (!window.$hsCollapseCollection.find(elC => (elC?.element?.el as HTMLElement) === el)) new HSCollapse(el)
    })
  }

  static show(target: HTMLElement) {
    const elInCollection = window.$hsCollapseCollection.find(
      el => el.element.el === (typeof target === 'string' ? document.querySelector(target) : target)
    )

    if (elInCollection && elInCollection.element.content.classList.contains('hidden')) elInCollection.element.show()
  }

  static hide(target: HTMLElement) {
    const elInCollection = window.$hsCollapseCollection.find(
      el => el.element.el === (typeof target === 'string' ? document.querySelector(target) : target)
    )

    if (elInCollection && !elInCollection.element.content.classList.contains('hidden')) elInCollection.element.hide()
  }

  // Backward compatibility
  static on(evt: string, target: HTMLElement, cb: Function) {
    const elInCollection = window.$hsCollapseCollection.find(
      el => el.element.el === (typeof target === 'string' ? document.querySelector(target) : target)
    )

    if (elInCollection) elInCollection.element.events[evt] = cb
  }
}

declare global {
  interface Window {
    HSCollapse: Function
    $hsCollapseCollection: ICollectionItem<HSCollapse>[]
  }
}

window.addEventListener('load', () => {
  HSCollapse.autoInit()

  // Uncomment for debug
  // console.log('Collapse collection:', window.$hsCollapseCollection);
})

if (typeof window !== 'undefined') {
  window.HSCollapse = HSCollapse
}

export default HSCollapse