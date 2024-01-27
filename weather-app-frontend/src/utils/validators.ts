export const validateString = (value: string): true | string => {
  const regex = /^[a-zA-Z]+$/
  if (regex.test(value)) return true
  return 'Only letters are allowed'
}
