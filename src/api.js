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

    getDagrun() {
        return fetch(`${this.url}dag_run`)
    }

    createRefAc(body, accessToken) {
        return fetch(`${this.url}RefAc_ins`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    createRefVat(body, accessToken) {
        return fetch(`${this.url}RefVat_ins`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    createRefVatArm(body, accessToken) {
        return fetch(`${this.url}RefVatArm_ins`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    editRefAc(body, accessToken) {
        return fetch(`${this.url}RefAc_upd`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    editRefVat(body, accessToken) {
        return fetch(`${this.url}RefVat_upd`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    editRefVatArm(body, accessToken) {
        return fetch(`${this.url}RefVatArm_upd`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    deleteRefAc(body, accessToken) {
        return fetch(`${this.url}RefAc_del`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    deleteRefVat(body, accessToken) {
        return fetch(`${this.url}RefVat_del`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    deleteRefVatArm(body, accessToken) {
        return fetch(`${this.url}RefVatArm_del`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
    }

    // auth
    signIn(body) {
        return fetch(`${this.url}user/user/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
    
    signUp(body) {
        return fetch(`${this.url}user/user/signup`, {
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