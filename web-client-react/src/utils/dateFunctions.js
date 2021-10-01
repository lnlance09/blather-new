import moment from "moment"

const hoursOffset = new Date().getTimezoneOffset() / 60

export const adjustTimezone = (date) => {
    let dateStr = date
    if (typeof date !== "undefined" && date !== null) {
        dateStr = typeof Date.parse(date) !== "undefined" ? date.replace(/-/g, "/") : date
    }
    return new Date(dateStr).getTime() - hoursOffset * 3600000
}

export const dateDiff = (dateOne, dateTwo) => {
    let newDate = new Date(dateOne)
    if (dateOne === null) {
        newDate = Date.now()
    }

    const momentOne = moment(newDate)
    const momentTwo = moment(new Date(dateTwo))
    const duration = moment.duration(momentTwo.diff(momentOne))
    return Math.ceil(duration.asDays())
}
