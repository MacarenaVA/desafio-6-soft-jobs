const pool = require("../db/conexion")
const bcrypt = require("bcryptjs")

const registration = async (usuario) => {
  let { email, password, rol, lenguage } = usuario
  const passwordEncoded = bcrypt.hashSync(password)
  password = passwordEncoded
  const values = [email, passwordEncoded, rol, lenguage]
  const consult = `INSERT INTO usuarios VALUES (DEFAULT,$1, $2, $3, $4)`
  await pool.query(consult, values)
}

const obtainUser = async (email) => {
  const values = [email]
  const consult = `SELECT * FROM usuarios WHERE email = $1`

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consult, values)

  if (!rowCount) {
    throw {
      code: 404,
      message: "Usuario no encontrado",
    }
  }
  delete usuario.password
  return usuario
}

const verifyUser = async (email, password) => {
  const values = [email]
  const consult = `SELECT * FROM usuarios WHERE email = $1`

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consult, values)

  const { password: passwordEncoded } = usuario
  const correctPassword = bcrypt.compareSync(password, passwordEncoded)

  if (!correctPassword || !rowCount)
    throw { code: 401, message: "Contraseña o email es incorrecto" }
}

module.exports = { registration, obtainUser, verifyUser }
