"use strict";

import './style.css'

const DEFAULT_VALUES = {
  autoClose: 5000,
  darkMode: false,
  status: 'success',
  backgroundColor: null,
  canClose: true,
  icon: null,
  message: 'Example message',
  position: 'top-right',
  showProgress: true,
}

export class Toast {
  show(options) {
    new ToastAlert(options);
  }
}

class ToastAlert {
  #toastElement
  #removeBinded
  #statusValue
  #darkModeValue
  #noHaveError
  #iconElement
  #visibleTimeSince
  #autoClose
  #progressInterval
  #autoCloseInterval

  constructor(options) { 
    this.#toastElement = document.createElement('div')
    this.#noHaveError = true
    this.#visibleTimeSince = new Date()
    this.#toastElement.classList.add('toast')
    requestAnimationFrame(() => { this.#toastElement.classList.add('show') })
    this.#removeBinded = () => this.#remove()
    Object.entries({ ...DEFAULT_VALUES, ...options }).forEach(([key, value]) => {
      this[key] = value
    })
  }

  set autoClose(value) {
    this.#autoClose = value
    if (value === false) return
    if (this.#autoCloseInterval != null) clearTimeout(this.#autoCloseInterval)
    this.#autoCloseInterval = setTimeout(() => { this.#remove() }, value)
  }

  set darkMode(value) {
    this.#darkModeValue = value
    if (value)
      this.#toastElement.classList.add('dark')
    else 
      this.#toastElement.classList.add('light')
  }

  set status(value) {
    try {
      this.#statusValue = value
      validateStatus(value)
      if (value === 'success')
        this.#toastElement.classList.add('success')
      else if (value === 'warning')
        this.#toastElement.classList.add('warning')
      else if (value === 'danger')
        this.#toastElement.classList.add('danger')
      else if (value === 'none')
        this.#toastElement.classList.add('none')
    } catch (error) {
      console.error(error)
      this.#noHaveError = false
    }
  }

  set backgroundColor(value) {
    try {
      if(value == null || value == '' || this.#statusValue != 'none')
        return
      validateBackgroundColor(value)
      let textColor = getTextColor(value)
      this.#toastElement.style.color = textColor
      let root = document.querySelector(':root')
      root.style.setProperty('--toast-bg-color-hover', value)
      if (this.#darkModeValue)
        root.style.setProperty('--toast-bg-color', calcHSL(value, true, textColor))
      else
        root.style.setProperty('--toast-bg-color', calcHSL(value, false, textColor))
    } catch (error) {
      console.error(error)
      this.#noHaveError = false
    }
  }

  set canClose(value) {
    this.#toastElement.classList.toggle('can-close', value)
    if (value)
      this.#toastElement.addEventListener('click', this.#removeBinded)
    else 
      this.#toastElement.removeEventListener('click', this.#removeBinded)
  }
  
  set icon(value) {
    let iconToast = document.createElement('i')
    iconToast.classList.add('toast-icon')
    if (this.#statusValue === 'success') {
      iconToast.classList.add('bx')
      iconToast.classList.add('bx-check')
      this.#iconElement = iconToast
    }
    else if (this.#statusValue === 'warning') {
      iconToast.classList.add('bx')
      iconToast.classList.add('bx-error')
      this.#iconElement = iconToast
    }
    else if (this.#statusValue === 'danger') {
      iconToast.classList.add('bx')
      iconToast.classList.add('bx-error-alt')
      this.#iconElement = iconToast
    }
    else if (this.#statusValue === 'none') {
      if(value) {
        let arrayClases = value.split(' ')
        for(let i = 0; i < arrayClases.length; i++){
          iconToast.classList.add(arrayClases[i])
        }
        this.#iconElement = iconToast
      }
    }
  }

  set message(value) {
    this.#toastElement.textContent = value
  }

  set position(value) {
    validatePosition(value)
    const selector = `.toast-container[data-position='${value}']`
    const toastContainer = document.querySelector(selector) || createContainer(value)
    if (this.#noHaveError) {
      if (this.#iconElement)
        this.#toastElement.prepend(this.#iconElement)
      toastContainer.append(this.#toastElement)
    }
  }

  set showProgress(value) {
    let bgColor
    this.#toastElement.classList.toggle('progress', value)
    this.#toastElement.style.setProperty('--progress', 1)
    
    if (this.#statusValue === 'none')
      bgColor = getComputedStyle(this.#toastElement).getPropertyValue('--toast-bg-color-hover');
    else if (this.#statusValue === 'success' & this.#darkModeValue)
      bgColor = '#34884f'
    else if (this.#statusValue === 'success' & !this.#darkModeValue)
      bgColor = '#54c477'
    else if (this.#statusValue === 'warning' & this.#darkModeValue)
      bgColor = '#be802a'
    else if (this.#statusValue === 'warning' & !this.#darkModeValue)
      bgColor = '#EEC476'
    else if (this.#statusValue === 'danger' & this.#darkModeValue)
      bgColor = '#AD3939'
    else if (this.#statusValue === 'danger' & !this.#darkModeValue)
      bgColor = '#E68686'

    this.#toastElement.style.setProperty('--progress-bg', bgColor)
    if (value) {
      this.#progressInterval = setInterval(() => {
        const timeVisible = new Date() - this.#visibleTimeSince
        this.#toastElement.style.setProperty('--progress', 1 - timeVisible / this.#autoClose)
      }, 10)
    }
  }

  #remove() {
    clearTimeout(this.#autoCloseInterval)
    clearInterval(this.#progressInterval)
    const toastContainer = this.#toastElement.parentElement
    this.#toastElement.classList.add('close')
    this.#toastElement.addEventListener('transitionend', () => {
      this.#toastElement.remove()
      if (toastContainer.hasChildNodes()) return
        toastContainer.remove()
    })
  }
}

function validatePosition(position) {
  const positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']
  if (!positions.includes(position))
    throw new Error('toast position is wrong')
  return
}

function validateStatus(status) {
  const styles = ['success', 'warning', 'danger', 'none']
  if (!styles.includes(status.toLowerCase()))
    throw new Error('toast status is wrong')
  return
}

function validateBackgroundColor(value) {
  if (value.length > 7 || value.charAt(0) != '#')
    throw new Error('toast background color hex format is wrong')
  if (!/^#[0-9A-F]{6}$/i.test(value))
    throw new Error('toast background color hex code is wrong')
  return
}

function getRBGColor(color) {
  var color_hex = color.substring(1, 7)
  var r = parseInt(color_hex.substring(0, 2), 16)
  var g = parseInt(color_hex.substring(2, 4), 16)
  var b = parseInt(color_hex.substring(4, 6), 16)
  return { r, g, b }
}

function getTextColor(bgColor) {
  let color = getRBGColor(bgColor)
  let uiColors = [ color.r / 255, color.g / 255, color.b / 255 ]
  let c = uiColors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92
    }
    return Math.pow((col + 0.055) / 1.055, 2.4)
  })
  let l = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2])
  return (l > 0.179) ? '#2D3748' : '#EDF2F7'
}

function calcHSL(bgColor, darkMode, textColor) {
  let color = getRBGColor(bgColor)
  color.r /= 255
  color.g /= 255
  color.b /= 255

  let cmin = Math.min(color.r, color.g, color.b),
      cmax = Math.max(color.r, color.g, color.b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0

  if (delta == 0)
    h = 0
  else if (cmax == color.r)
    h = ((color.g - color.b) / delta) % 6
  else if (cmax == color.g)
    h = (color.b - color.r) / delta + 2
  else
    h = (color.r - color.g) / delta + 4
  h = Math.round(h * 60)
  if (h < 0)
    h += 360

  l = (cmax + cmin) / 2
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  if (darkMode)
    l = (l - 10) < 0 ? 0 : l - 10
  else {
    if (textColor == '#EDF2F7')
      l = (l + 38) > 62 ? 62 : l + 38
    else 
      l = (l + 38) > 90 ? 90 : l + 38
  }
    
  return 'hsl(' + h + ',' + s + '%,' + l + '%)'
}

function createContainer(position) {
  validatePosition(position)
  const container = document.createElement('div')
  container.classList.add('toast-container')
  container.dataset.position = position
  document.body.append(container)
  return container
}