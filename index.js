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
    new ToastAlert(options)
  }
  info(message, theme) {
    new ToastAlert({
      autoClose: 5000,
      darkMode: theme,
      message: message,
      status: 'info',
      position: 'top-right'
    })
  }
  success(message, theme) {
    new ToastAlert({
      autoClose: 5000,
      darkMode: theme,
      message: message,
      status: 'success',
      position: 'top-right'
    })
  }
  warning(message, theme) {
    new ToastAlert({
      autoClose: 5000,
      darkMode: theme,
      message: message,
      status: 'warning',
      position: 'top-right'
    })
  }
  danger(message, theme) {
    new ToastAlert({
      autoClose: 5000,
      darkMode: theme,
      message: message,
      status: 'danger',
      position: 'top-right'
    })
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
    this.#toastElement.classList.add('makki-toast')
    requestAnimationFrame(() => { this.#toastElement.classList.add('makki-show') })
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
      this.#toastElement.classList.add('makki-dark-toast')
    else 
      this.#toastElement.classList.add('makki-light-toast')
  }

  set status(value) {
    try {
      this.#statusValue = value
      validateStatus(value)
      if (value === 'success')
        this.#toastElement.classList.add('makki-success')
      else if (value === 'warning')
        this.#toastElement.classList.add('makki-warning')
      else if (value === 'danger')
        this.#toastElement.classList.add('makki-danger')
      else if (value === 'info')
        this.#toastElement.classList.add('makki-info')
      else if (value === 'none')
        this.#toastElement.classList.add('makki-none')
    } catch (error) {
      console.error(error)
      this.#noHaveError = false
    }
  }

  set backgroundColor(value) {
    let hexColor
    try {
      if(value == null || value == '' || this.#statusValue != 'none')
        return
      validateBackgroundColor(value)
      let root = document.querySelector(':root')
      root.style.setProperty('--makki-toast-bg-color-hover', value)

      if (this.#darkModeValue)
        hexColor = calcHexColor(value, true)
      else
        hexColor = calcHexColor(value, false)
      
      root.style.setProperty('--makki-toast-bg-color', hexColor)
      let textColor = getTextColor(hexColor)
      this.#toastElement.style.color = textColor

      const textColorHover = getTextColor(value)
      console.log(textColorHover)
      this.#toastElement.style.setProperty('--makki-toast-bg-color-text', textColorHover)

    } catch (error) {
      console.error(error)
      this.#noHaveError = false
    }
  }

  set canClose(value) {
    this.#toastElement.classList.toggle('makki-can-close', value)
    if (value)
      this.#toastElement.addEventListener('click', this.#removeBinded)
    else 
      this.#toastElement.removeEventListener('click', this.#removeBinded)
  }
  
  set icon(value) {
    let iconToast = document.createElement('i')
    iconToast.classList.add('makki-toast-icon')
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
      iconToast.classList.add('bx-x')
      this.#iconElement = iconToast
    }
    else if (this.#statusValue === 'info') {
      iconToast.classList.add('bx')
      iconToast.classList.add('bx-info-circle')
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
    const selector = `.makki-toast-container[data-position='${value}']`
    const toastContainer = document.querySelector(selector) || createContainer(value)
    if (this.#noHaveError) {
      if (this.#iconElement)
        this.#toastElement.prepend(this.#iconElement)
      toastContainer.append(this.#toastElement)
    }
  }

  set showProgress(value) {
    let bgColor
    this.#toastElement.classList.toggle('makki-progress', value)
    this.#toastElement.style.setProperty('--makki-progress', 1)
    
    if (this.#statusValue === 'none')
      bgColor = getComputedStyle(this.#toastElement).getPropertyValue('--makki-toast-bg-color-hover');
    else if (this.#statusValue === 'success')
      bgColor = '#38A95C'
    else if (this.#statusValue === 'warning')
      bgColor = '#ECC94B'
    else if (this.#statusValue === 'danger')
      bgColor = '#D74B4B'
    else if (this.#statusValue === 'info')
      bgColor = '#3182CE'

    this.#toastElement.style.setProperty('--makki-progress-bg', bgColor)
    if (value) {
      this.#progressInterval = setInterval(() => {
        const timeVisible = new Date() - this.#visibleTimeSince
        this.#toastElement.style.setProperty('--makki-progress', 1 - timeVisible / this.#autoClose)
      }, 10)
    }
  }

  #remove() {
    clearTimeout(this.#autoCloseInterval)
    clearInterval(this.#progressInterval)
    const toastContainer = this.#toastElement.parentElement
    this.#toastElement.classList.add('makki-close')
    this.#toastElement.addEventListener('transitionend', () => {
      this.#toastElement.remove()
      if (toastContainer.hasChildNodes()) return
        toastContainer.remove()
    })
  }
}

function createContainer(position) {
  validatePosition(position)
  const container = document.createElement('div')
  container.classList.add('makki-toast-container')
  container.dataset.position = position
  document.body.append(container)
  return container
}

function getHex(or, og, ob) {
  let r = or.toString(16)
  let g = og.toString(16)
  let b = ob.toString(16)

  if (r.length == 1)
    r = "0" + r
  if (g.length == 1)
    g = "0" + g
  if (b.length == 1)
    b = "0" + b

  return "#" + r + g + b
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
  return (l > 0.279) ? '#050505' : '#EDF2F7'
}

function calcTintColor(or,og,ob) {
  const r = or + Math.round((255 - or) * 0.18)
  const g = og + Math.round((255 - og) * 0.18)
  const b = ob + Math.round((255 - ob) * 0.18)
  return { r, g, b }
}

function calcShadeColor(or,og,ob) {
  const r = Math.round(or * 0.8)
  const g = Math.round(og * 0.8)
  const b = Math.round(ob * 0.8)
  return { r, g, b }
}

function calcHexColor(bgColor, darkMode) {
  let color = getRBGColor(bgColor)
  
  if (darkMode)
    Object.assign(color, calcShadeColor(color.r, color.g, color.b));
  else 
    Object.assign(color, calcTintColor(color.r, color.g, color.b));
  
  return getHex(color.r, color.g, color.b)
}

function validateBackgroundColor(value) {
  if (value.length > 7 || value.charAt(0) != '#')
    throw new Error('toast background color hex format is wrong')
  if (!/^#[0-9A-F]{6}$/i.test(value))
    throw new Error('toast background color hex code is wrong')
  return
}

function validatePosition(position) {
  const positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']
  if (!positions.includes(position))
    throw new Error('toast position is wrong')
  return
}

function validateStatus(status) {
  const styles = ['success', 'warning', 'danger', 'info', 'none']
  if (!styles.includes(status.toLowerCase()))
    throw new Error('toast status is wrong')
  return
}

