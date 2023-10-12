<a href="https://daniel-jimenez.tech/makki-toast/"><img alt="makki toast - Try it" src="assets/Logo.png"/></a>
<div align="center">
  <img src="https://badgen.net/npm/v/makki-toast" alt="NPM Version" />
  <img src="https://badgen.net/packagephobia/install/makki-toast" alt="install size"/>
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
  <span> · </span>
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

```jsx
import { Toast } from 'makki-toast';

const App = () => {
  const toast = new Toast();

  const handleToast = () => {
    toast.show({
      autoClose: 5000,
      darkMode: false,
      message: 'Simple text',
      position: 'top-right'
    })
  };
  
  return (
    <div>
      <button onClick={handleToast}>Make me a toast</button>
    </div>
  );
};
```

## Documentation

Find the full documentation on [official documentation](https://daniel-jimenez.tech/makki-toast/#/docs)

Build by Daniel Jimenez