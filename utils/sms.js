const axios = require('axios')

const SMS = (phone,message)=> {

    const data = {
        email:"axror.uzza@mail.ru",
        password: "J17vF2MlnfoJNHaehj46Gmic3cCS4brsyLhkInuv"
    }
    axios.post('http://notify.eskiz.uz/api/auth/login', data).then((response)=>{
            axios.post('http://notify.eskiz.uz/api/message/sms/send', {
                headers:{Authorization: `Bearer ${response.data.data.token}`} },
                {
                    mobile_phone: phone,
                    message: message
                }).then((resp)=>{
                  console.log(true)
                })
                .catch((e)=>{
                    console.log(e)
                })
        })
}
export default SMS;