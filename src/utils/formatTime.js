const formatTime = (msTime) => {
    const date = new Date(parseInt(msTime))
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return msTime ? `${year}-${month}-${day}` : ''
}

export default formatTime
