class Api {
    constructor() {
        this.url = "https://hbiapi.onrender.com/"
    }

    getAudits(date) {
        return fetch(`${this.url}audit/?` + new URLSearchParams({
            audit_date: date
        }))
    }

    getRefAc() {
        return fetch(`${this.url}RefAc`)
    }
}

export default Api;