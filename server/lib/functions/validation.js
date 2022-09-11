const validatePhone = (phone) => {
    const reg = /^222[2|3|4]\d{7}$/

    return reg.test(phone)
}

module.exports = {
    validatePhone
}