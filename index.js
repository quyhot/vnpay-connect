const express = require('express')
const app = express()
const axios = require('axios')
const moment = require("moment");
const crypto = require("crypto");
const qs = require('qs')

const tmnCode = ''
const secretKey = ''
const vnpUrl = ''

const randomOrderRef = () => {
    return Math.floor(Math.random() * 100000)
}

const createPaymentUrl = (req, res, next) => {
    const data = {
        vnp_Amount: 15202000,
        vnp_Command: 'pay',
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: '127.0.0.1',
        vnp_Locale: 'vn',
        vnp_OrderInfo: 'thanh toan don hang 50',
        vnp_ReturnUrl: 'http://localhost:3000/test',
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: randomOrderRef(),
        vnp_Version: '2.0.1'
    }
    const signData = qs.stringify(data, {encode: false});
    const hmac = crypto.createHmac("sha512", secretKey);
    data.vnp_SecureHash = hmac.update(new Buffer(signData, 'utf-8')).digest("hex")
    const url = `${vnpUrl}?${qs.stringify(data, {encode: false})}`
    return res.redirect(url)
}

// const createIpnUrl = (req, res) => {
//     const q = req.query
//     const secureHash = vnp_SecureHash
//     delete q.vnp_SecureHash
//     delete q.vnp_SecureHashType
//
//     const signData = qs.stringify(q.toObject(), {encode: false});
//     const hmac = crypto.createHmac("sha512", secretKey);
//     const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex")
//     if(secureHash === signed){
//         const orderId = vnp_Params['vnp_TxnRef'];
//         const rspCode = vnp_Params['vnp_ResponseCode'];
//         //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
//         res.status(200).json({RspCode: '00', Message: 'success'})
//     }
//     else {
//         res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
//     }
// }

app.get('/', createPaymentUrl)

app.get('/test', function (req, res) {
    res.status(200).json({msg: 'oke'})
})

// app.get('/vnpayIpn', createIpnUrl)

app.listen(3000)
