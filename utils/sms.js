const axios = require('axios')

module.exports = (phone,message) => {

    const data = {
        email:"clozzone2021@gmail.com",
        password: "rxginrFuU2vYka7W1RG2JMbH1kpcwPOFAWOhlneX"
    }
    axios.post('http://notify.eskiz.uz/api/auth/login', data).then((response)=>{
            const data = {
                mobile_phone: phone,
                message: message
            }
            console.log(response.data.data.token)
            axios.post('http://notify.eskiz.uz/api/message/sms/send', {
                headers:{Authorization: `Bearer ${response.data.data.token}`} },
                {
                    mobile_phone: phone,
                    message: message
                }).then((resp)=>{
                  console.log(true)
                })
                .catch((e)=>{
                    console.log(e.response)
                })
        })
}

// email:"axror.uzza@mail.ru",
// password: "J17vF2MlnfoJNHaehj46Gmic3cCS4brsyLhkInuv"