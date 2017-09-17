export default {
  http: {
    baseURL: 'http://localhost:3181',
    withCredentials: true,
    maxRedirects: 0,
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    transformResponse: data => new Uint8Array(data),
    responseType: 'arraybuffer'
  }
}