const baseUrl = 'http://localhost:5000/api'

async function get(url) {
  const requestOptions = {
    method: 'GET',
  }
  const response = await fetch(baseUrl + url, requestOptions)
  return await HandleResponse(response)
}

async function post(url, body) {
  const requestOptions = {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  }
  const response = await fetch(baseUrl + url, requestOptions)
  return await HandleResponse(response)
}

async function put(url, body) {
  const requestOptions = {
    method: 'PUT',
    headers: await getHeaders(),
    body: JSON.stringify(body),
  }
  const response = await fetch(baseUrl + url, requestOptions)
  return await HandleResponse(response)
}

async function del(url) {
  const requestOptions = {
    method: 'DELETE',
    headers: await getHeaders(),
  }
  const response = await fetch(baseUrl + url, requestOptions)
  return await HandleResponse(response)
}

async function HandleResponse(response) {
  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (error) {
    data = text
  }
  if (response.ok) {
    return data || response.statusText
  } else {
    const error = {
      status: response.status,
      message: typeof data === 'string' && data.length > 0 ? data : response.statusText,
    }
    return { error }
  }
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
}
export default fetchWrapper
