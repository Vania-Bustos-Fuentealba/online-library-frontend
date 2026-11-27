// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarRun(run) {
  // Nota de lectura: Define limpio, que se utiliza en las instrucciones siguientes.
  const limpio = String(run ?? '').toUpperCase()

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!/^\d{6,8}[0-9K]$/.test(limpio)) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return false
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define cuerpo, que se utiliza en las instrucciones siguientes.
  const cuerpo = limpio.slice(0, -1)
  // Nota de lectura: Define digitoVerificador, que se utiliza en las instrucciones siguientes.
  const digitoVerificador = limpio.slice(-1)

  // Nota de lectura: Define suma, que se utiliza en las instrucciones siguientes.
  let suma = 0
  // Nota de lectura: Define multiplicador, que se utiliza en las instrucciones siguientes.
  let multiplicador = 2

  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    suma += parseInt(cuerpo[i], 10) * multiplicador
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    multiplicador++

    // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
    if (multiplicador > 7) {
      // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
      multiplicador = 2
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Define resto, que se utiliza en las instrucciones siguientes.
  const resto = 11 - (suma % 11)

  // Nota de lectura: Define resultado, que se utiliza en las instrucciones siguientes.
  let resultado
  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (resto === 11) {
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    resultado = '0'
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  } else if (resto === 10) {
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    resultado = 'K'
  // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
  } else {
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    resultado = String(resto)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return resultado === digitoVerificador
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarEmail(email) {
  // Nota de lectura: Normaliza texto para comparar y guardar datos sin espacios externos o diferencias de mayúsculas.
  const limpio = email.trim().toLowerCase()

  // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
    return false
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  }

  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return (
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    limpio.endsWith('@duoc.cl') ||
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    limpio.endsWith('@profesor.duoc.cl') ||
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    limpio.endsWith('@gmail.com')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
export function validarPassword(password) {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return password.length >= 4 && password.length <= 10
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
