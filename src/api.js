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

    getRefVat() {
        return fetch(`${this.url}RefVat`)
    }

    getRefVatArm() {
        return fetch(`${this.url}RefVatArm`)
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

    createRefVat(body) {
        return fetch(`${this.url}RefVat_ins`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    createRefVatArm(body) {
        return fetch(`${this.url}RefVatArm_ins`, {
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

    editRefVat(body) {
        return fetch(`${this.url}RefVat_upd`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    editRefVatArm(body) {
        return fetch(`${this.url}RefVatArm_upd`, {
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

    deleteRefVat(body) {
        return fetch(`${this.url}RefVat_del`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }

    deleteRefVatArm(body) {
        return fetch(`${this.url}RefVatArm_del`, {
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