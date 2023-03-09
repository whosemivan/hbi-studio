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

    createRefAc(body) {
        return fetch(`${this.url}RefAc_ins`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    editRefAc(body) {
        return fetch(`${this.url}RefAc_upd`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    deleteRefAc(body) {
        return fetch(`${this.url}RefAc_del`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
}

export default Api;