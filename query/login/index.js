const pool = require("../../database");
const express = require('express');
const router = express.Router()

router.post('/signup', (req, res) => {
  let body = req.body;
  const submit = async () => {
    let mainQuery = `INSERT INTO myra_user ( name, mobno, password ) 
      VALUES ( '${body.name}', '${body.mobno}', '${body.password}');`
    let checkQuery = `SELECT COUNT(*) AS cnt FROM myra_user WHERE mobno = '${body.mobno}'`
    pool.query(
      checkQuery,
      async function (err, data) {
        console.log("data", data)
        console.log("err", err)
        if (data[0].cnt > 0) {
          return res.status(422).json({
            success: false,
            messagecode: 422,
            message: "user already exist",
          });
        } else {
          pool.query(mainQuery, async function (err, data) {
            if (data && data.affectedRows) {
              return res.status(200).json({
                success: true,
                messagecode: 101,
                message: "record added",
              });
            }

            if (err) {
              return res.status(200).json({
                success: false,
                messagecode: 440,
                message: err.sqlMessage
              });
            }
          })
        }
        if (err) {
          return res.status(200).json({
            success: false,
            messagecode: 440,
            message: err.sqlMessage
          });
        }
      }
    );
  }
  submit()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.get('/user/:id', (req, res) => {
  let params = req.params
  let SQLData = `SELECT * FROM myra_user WHERE id= ${params.id}`;
  pool.query(SQLData, async function (err, userData) {
    if (err) {
      return res.status(422).json({
        success: false,
        messagecode: 500,
        message: err,
      });
    }

    if (userData) {
      return res.status(200).json({
        success: true,
        messagecode: 101,
        message: "records",
        records: userData[0],
      });
    }
  })
})

router.post('/login', (req, res) => {
  let body = req.body;
  const submit = async () => {
    let SQL = `SELECT COUNT(*) AS cnt FROM myra_user WHERE mobno = ${body.mobno} and password = '${body.password}'`;
    let SQLData = `SELECT * FROM myra_user WHERE mobno = ${body.mobno} and password = '${body.password}'`;

    pool.query(
      SQL,
      async function (err, data) {
        if (err) {
          return res.status(422).json({
            success: false,
            messagecode: 500,
            message: err,
          });
        }
        console.log("data", data, (data[0].cnt > 0))
        if (data && (data[0].cnt > 0)) {
          pool.query(SQLData, async function (err, userData) {
            if (err) {
              return res.status(422).json({
                success: false,
                messagecode: 500,
                message: err,
              });
            }

            if (userData) {
              return res.status(200).json({
                success: true,
                messagecode: 101,
                message: "records",
                records: userData[0],
              });
            }
          })
        } else {
          console.log("already")
          return res.status(422).json({
            success: false,
            messagecode: 422,
            message: "Invalid user id / password",
          });
        }
      }
    )
  }
  submit()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

module.exports = router