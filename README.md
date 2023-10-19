<a href="https://daniel-jimenez.tech/makki-toast/"><img alt="makki toast - Try it" src="https://daniel-jimenez.tech/images/makkitoast.png"/></a>
<div align="center">
  <img src="https://badgen.net/npm/v/makki-toast" alt="NPM Version" />
  <img src="https://img.shields.io/bundlephobia/minzip/makki-toast" alt="Minzip size"/>
  <img src="https://img.shields.io/npm/dt/makki-toast" alt="Download" />
  <img src="https://img.shields.io/github/license/DanielJimenezC/makki-toast-package" alt="Licence" />
  
</div>
<br />
<div align="center">
  <strong>Creative makki toast.</strong>
</div>
<div align="center">Easy to use, customizable & compatible with dark mode.</div>
<br />
<div align="center">
  <a href="https://daniel-jimenez.tech/makki-toast/">Website</a> 
  <span> · </span>
  <a href="https://daniel-jimenez.tech/makki-toast/#/docs">Documentation</a> 
</div>
<br />
<div align="center">
  <sub>Build by <a href="https://daniel-jimenez.tech">Daniel Jimenez</a></sub>
</div>
<br />

## Features

- **Easy to use**
- **Customizable**
- **Dark mode**
- **Lightweight**
- **Accessible**

## Installation

#### With NPM

```sh
npm install makki-toast@latest
```
## Getting Started

Add the makki toast and it will take care of render the alerts.
#### Import Makki Toast
```jsx
import { Toast } from 'makki-toast'
```

#### Info
```jsx
const toast = new Toast()

const handleToast = () => {
  toast.info('Simple text', false)
}
```

#### Success
```jsx
const toast = new Toast()

const handleToast = () => {
  toast.success('Simple text', false)
}
```

#### Warning
```jsx
const toast = new Toast()

const handleToast = () => {
  toast.warning('Simple text', false)
}
```

#### Danger
```jsx
const toast = new Toast()

const handleToast = () => {
  toast.danger('Simple text', false)
}
```

#### Custom
```jsx
import { Toast } from 'makki-toast'

const App = () => {
  const toast = new Toast()

  const handleToast = () => {
    toast.show({
      autoClose: 5000,
      darkMode: false,
      message: 'Simple text',
      position: 'top-right'
    })
  }
  
  return (
    <div>
      <button onClick={handleToast}>Show Makki Toast</button>
    </div>
  )
}
```

## Documentation

Find the full documentation on [official documentation](https://daniel-jimenez.tech/makki-toast/#/docs)
