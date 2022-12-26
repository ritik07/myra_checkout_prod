const pool = require("../../database");
const express = require("express");
const router = express.Router();

router.post(
  "/checkout",
  (req, res) => {
    let body = req.body;
    const submit = async () => {
      if (body.action === "INSERT") {
        pool.query(
          `INSERT INTO myra_checkout ( user_id, visit_name, checkin_lat, checkin_lng, checkout_lat, checkout_lng, checkin_time, date ) 
              VALUES ( ${body.user_id}, '${body.visit_name}', '${body.checkin_lat}', '${body.checkin_lng}',
              '${body.checkout_lat}', '${body.checkout_lng}', '${body.checkin_time}', '${body.date}');`,
          //callback
          async function (err, data) {
            if (data && data.affectedRows) {
              return res.status(200).json({
                success: true,
                messagecode: 101,
                data: data,
                message: "record added",
              });
            }
            if (err) {
              return res.status(200).json({
                success: false,
                messagecode: 440,
                message: err.sqlMessage,
              });
            }
          }
        );
      } else if (body.action === "PUT") {
        pool.query(
          `UPDATE myra_checkout SET checkout_time='${body.checkout_time}', checkout_lng = '${body.checkout_lng}', checkout_lat = '${body.checkout_lat}' where id=${body.id};`,
          async function (err, data) {
            if (data && data.affectedRows) {
              // res.send(req.files)
              return res.status(200).json({
                success: true,
                messagecode: 101,
                message: "record updated",
              });
            }
            if (err) {
              return res.status(200).json({
                success: false,
                messagecode: 440,
                message: err.sqlMessage,
              });
            }
          }
        );
      }
    };
    submit();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/checkoutdetails/:id", (req, res) => {
  let { id } = req.params;
  console.log("id", id);
  const submit = async () => {
    // `select name, mobno, visit_name, checkin_lat, checkin_out, checkout_in, checkout_out, checkin_time, checkout_time, date from myra_user as mu inner join myra_checkout as mc on mc.user_id = mu.id where mu.id=${id}`
    pool.query(
      `select * from myra_user as mu inner join myra_checkout as mc on mc.user_id = mu.id where mu.id=${id}`,
      async function (err, data) {
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
      }
    );
  };
  submit();
});

module.exports = router;
