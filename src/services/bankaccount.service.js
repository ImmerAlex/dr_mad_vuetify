import LocalSource from "@/datasource/controller";

async function getAccountAmountFromLocalSource(number) {
    // récupération auprès de la source locale
    return LocalSource.getAccountAmount(number)
}

async function loginToBankAccountFromLocalSource(number) {
    // récupération auprès de la source locale
    return LocalSource.loginToBankAccount(number)
}

async function getTransactionFromIdFromLocalSource(id){
    return LocalSource.getTransactionFromId(id)
}

async function getAllTransactionsFromLocalSource(){
    return LocalSource.getAllTransactions();
}

async function getAllTransactions(){
    let response;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAllTransactionsFromLocalSource()
    }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions' }
    }
    return response
}

async function getTransactionFromId(id){
    let response;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getTransactionFromIdFromLocalSource(id)
    }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la transaction' }
    }
    return response
}

async function getAccountAmount(number) {
    let response;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAccountAmountFromLocalSource(number)
    }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de se loguer' }
    }
    return response
}

async function loginToBankAccount(number) {
    let response;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await loginToBankAccountFromLocalSource(number)
    }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de se loguer' }
    }

    return response
}

export default {
    getAccountAmount,
    loginToBankAccount,
    getTransactionFromId,
    getAllTransactions
}
