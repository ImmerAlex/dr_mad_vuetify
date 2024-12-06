import LocalSource from "@/datasource/controller";

async function loginFromLocalSource(data) {
    return LocalSource.loginUser(data)
}

async function loginUser(data) {
    let response;

    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await loginFromLocalSource(data)
    } catch(err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
    }

    return response
}

export default {
    loginUser,
}