import { Base } from './base'
import { Exec } from './exec'

export interface Tabs extends Exec {
}

export abstract class Tabs extends Base {

  maximize(windowHandle = 'current') {
    return this.webdriver.maximizeWindow({ windowHandle })
  }

  setPosition(x: number, y: number, windowHandle = 'current') {
    return this.webdriver.setWindowPosition({ windowHandle, x, y })
  }

  getPosition(windowHandle = 'current') {
    return this.webdriver.getWindowPosition({ windowHandle })
  }

  setSize(width: number, height: number, windowHandle = 'current') {
    return this.webdriver.setWindowSize({ windowHandle, width, height })
  }

  getSize(windowHandle = 'current') {
    return this.webdriver.getWindowSize({ windowHandle })
  }

  getViewSize(): Promise<{ width: number, height: number }> {
    return this.execute(() => {
      return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }
    })
  }

  getTab() {
    return this.webdriver.getWindowHandle()
  }

  getTabs() {
    return this.webdriver.getWindowHandles()
  }

  async switchTab(name: string, ontop?: boolean) {
    await this.webdriver.switchToWindow({ name })
    if (ontop) await this.webdriver.screenshot()
  }

  async closeTab(name?: string) {
    const tab = await this.getTab()
    if (name !== tab) {
      await this.switchTab(name)
      await this.webdriver.closeWindow()
      await this.switchTab(tab)
    } else {
      const tabs = await this.getTabs()
      let newtab = null
      if (tabs.length > 1) {
        newtab = tabs[tabs.indexOf(tab) + (tabs[0] != tab ? -1 : 1)]
      }
      await this.webdriver.closeWindow()
      if (newtab != null) await this.switchTab(newtab)
    }
  }

  newTab(switchTo?: boolean): Promise<string>
  newTab(url: string, switchTo?: boolean): Promise<string>
  async newTab(url?: string | boolean, switchTo = false) {
    if (typeof url !== 'string') {
      switchTo = url
      url = undefined
    }
    await this.execute((url: string) => {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.click()
    }, url || '')
    const tabs = await this.getTabs()
    const newtab = tabs[tabs.length - 1]
    if (switchTo) await this.switchTab(newtab)
    return newtab
  }

  onTop() {
    return this.webdriver.screenshot()
  }

}
