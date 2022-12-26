const pool = require("../../database");
const express = require("express");
const router = express.Router();

router.get(
  "/users",
  (req, res) => {
    let body = req.body;
    const submit = async () => {
      let sSQL = `Select * from myra_user `;
      if (body.id > 0) sSQL = sSQL + `where id=${id}`;
      pool.query(sSQL, async function (err, data) {
        if (err) {
          return res.status(200).json({
            success: false,
            messagecode: 442,
            message: err,
          });
        } else {
          return res.status(200).json({
            success: true,
            messagecode: 101,
            message: "records",
            records: data,
          });
        }
      });
    };
    submit();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
