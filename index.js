// Almacenamiento local para las URLs guardadas
let urlDatabase = JSON.parse(localStorage.getItem('urlDatabase')) || {}

function createShortUrl() {
  const longUrl = document.getElementById('longUrl').value
  const customAlias = document.getElementById('customAlias').value
  const resultDiv = document.getElementById('result')

  // Validaciones
  if (!isValidUrl(longUrl)) {
    showResult('Por favor, ingresa una URL válida', false)
    return
  }

  if (!isValidAlias(customAlias)) {
    showResult('El alias solo puede contener letras, números y guiones', false)
    return
  }

  if (urlDatabase[customAlias]) {
    showResult('Este alias ya está en uso. Por favor, elige otro.', false)
    return
  }

  // Guardar la URL
  urlDatabase[customAlias] = {
    longUrl: longUrl,
    createdAt: new Date().toISOString()
  }
  localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase))

  // Mostrar resultado
  const shortUrl = `https://shortener-neider.netlify.app/${customAlias}`
  showResult(
    `
        <p>¡URL acortada creada con éxito!</p>
        <p><strong>URL Corta:</strong> ${shortUrl}</p>
        <button onclick="copyToClipboard('${shortUrl}')" class="copy-btn">Copiar URL</button>
    `,
    true
  )

  // Actualizar lista
  updateUrlList()

  // Limpiar campos
  document.getElementById('longUrl').value = ''
  document.getElementById('customAlias').value = ''
}

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

function isValidAlias(alias) {
  return /^[a-zA-Z0-9-]+$/.test(alias)
}

function showResult(message, isSuccess) {
  const resultDiv = document.getElementById('result')
  resultDiv.style.display = 'block'
  resultDiv.className = isSuccess ? 'success' : 'error'
  resultDiv.innerHTML = message
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert('URL copiada al portapapeles'))
    .catch((err) => alert('Error al copiar la URL'))
}

function deleteUrl(alias) {
  delete urlDatabase[alias]
  localStorage.setItem('urlDatabase', JSON.stringify(urlDatabase))
  updateUrlList()
  showResult('URL eliminada correctamente', true)
}

function updateUrlList() {
  const urlListDiv = document.getElementById('urlList')
  const urls = Object.entries(urlDatabase)

  if (urls.length === 0) {
    urlListDiv.innerHTML = '<h3>URLs Guardadas</h3><p>No hay URLs guardadas</p>'
    return
  }

  let html = '<h3>URLs Guardadas</h3>'
  urls.forEach(([alias, data]) => {
    html += `
            <div class="url-item">
                <p><strong>URL Corta:</strong> https://shortener-neider.netlify.app/${alias}</p>
                <p><strong>URL Original:</strong> ${data.longUrl}</p>
                <p><strong>Creada:</strong> ${new Date(
                  data.createdAt
                ).toLocaleString()}</p>
                <button onclick="deleteUrl('${alias}')" class="delete-btn">Eliminar</button>
            </div>
        `
  })
  urlListDiv.innerHTML = html
}

// Cargar URLs guardadas al inicio
updateUrlList()
