const network = {
  host: 'localhost', // Дом
  port: '5000'
}

export const config = Object.freeze({
  ...network,
  addr: `http://${network.host}:${network.port}`
})
