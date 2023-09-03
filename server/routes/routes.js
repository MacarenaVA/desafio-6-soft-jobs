const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
require("dotenv").config()

const {
  registration,
  obtainUser,
  verifyUser,
} = require("../consultas/consultas")
const {
  checkCredentialsExist,
  tokenVerification,
} = require("../middleware/middleware")

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.post("/usuarios", checkCredentialsExist, async (req, res) => {
  try {
    const usuarios = req.body
    await registration(usuarios)
    res.send("Usuario registrado con éxito!")
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/usuarios", tokenVerification, async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const { email } = jwt.decode(token)
    const usuario = await obtainUser(email)
    res.json(usuario)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    await verifyUser(email, password)
    const token = jwt.sign({ email }, process.env.SECRET)
    res.send(token)
  } catch (error) {
    res.status(500).send(error)
  }
})
module.exports = router
