const axios = require("axios");

function SMS(phone, message) {
    console.log("phone", phone);
    console.log("mss", message);

    const data = {
        email: "axror.uzza@mail.ru",
        password: "J17vF2MlnfoJNHaehj46Gmic3cCS4brsyLhkInuv",
    };
    axios({
        method: "POST",
        url: "http://notify.eskiz.uz/api/auth/login",
        data,
    }).then((response) => {
        const text = {
            mobile_phone: phone,
            message: message,
        };
        axios({
            method: "POST",
            url: "http://notify.eskiz.uz/api/message/sms/send",
            headers: {
                Authorization: `Bearer ${response.data.data.token}`,
            },
            data: text,
        })
            .then((resp) => {
                // console.log(true);
            })
            .catch((e) => {
                // console.log(e);
            });
    });
}
module.exports = SMS;