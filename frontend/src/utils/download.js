export function downloadCsv(filename, _data) {
  const link = document.createElement('a')

  link.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(_data)
  )
  link.setAttribute('download', filename || 'data.csv')
  link.style.display = 'none'

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}
