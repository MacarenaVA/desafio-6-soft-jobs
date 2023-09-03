const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkCredentialsExist = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(401)
      .json({ message: "No se recibieron las credenciales en esta consulta" })
  }
  next()
}

const tokenVerification = (req, res, next) => {
  const token = req.header("Authorization").split("Bearer ")[1]
  if (!token)
    throw {
      code: 401,
      message: "Debe incluir el token de autenticación",
    }

  const validToken = jwt.verify(token, process.env.SECRET)
  if (!validToken) throw { code: 401, message: "El token es inválido" }
  next()
}

module.exports = { checkCredentialsExist, tokenVerification }
