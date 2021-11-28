export const v_username = [
    { required: true, whitespace: true, message: '请输入用户名!', },
    { min: 4, message: '用户名至少四位!', },
    { max: 12, message: '用户名最多十二位!', },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名由英文数字和下划线组成!', },
  ]

export const v_password = [
    { required: true, whitespace: true, message: '请输入密码!', },
    { min: 4, message: '密码至少四位!', },
    { max: 12, message: '密码最多十二位!', },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码由英文数字和下划线组成!', },
  ]

export const v_tel = [
    { required: false},
    { pattern: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[01356789]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|6[567]\d{2}|4(?:[14]0\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/, message: "手机号格式错误，必须为中国大陆手机号"}
]

export const v_email = [
    {required: false},
    {pattern: /\S+@\S+\.\S+/, message:'邮箱格式错误'}
]