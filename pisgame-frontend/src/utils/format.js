export function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value === '' ? null : value]),
  )
}

export function formatDate(value) {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}
