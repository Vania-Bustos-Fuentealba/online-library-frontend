export function validarRun(run) {
  const limpio = run.toUpperCase().replace(/\s/g, '')

  if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
    return false
  }

  const cuerpo = limpio.slice(0, -1)
  const digitoVerificador = limpio.slice(-1)

  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador
    multiplicador++

    if (multiplicador > 7) {
      multiplicador = 2
    }
  }

  const resto = 11 - (suma % 11)

  let resultado
  if (resto === 11) {
    resultado = '0'
  } else if (resto === 10) {
    resultado = 'K'
  } else {
    resultado = String(resto)
  }

  return resultado === digitoVerificador
}

export function validarEmail(email) {
  const limpio = email.trim().toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    return false
  }

  return (
    limpio.endsWith('@duoc.cl') ||
    limpio.endsWith('@profesor.duoc.cl') ||
    limpio.endsWith('@gmail.com')
  )
}

export function validarPassword(password) {
  return password.length >= 4 && password.length <= 10
}