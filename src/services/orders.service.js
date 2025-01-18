import LocalSource from "@/datasource/controller";

async function getUserOrdersFromLocalSource(userId) {
    return LocalSource.getUserOrders(userId)
}

async function getUserOrderByUuidByLocalSource(userId, orderUuid) {
    return LocalSource.getUserOrderByUuid(userId, orderUuid)
}

function getTransactionFromNotLocalSource(transactionUuid, transactions) {
    return transactions.find(t => t.uuid === transactionUuid);
}

async function getUserOrders(userId) {
    let response;
    try {
        response = await getUserOrdersFromLocalSource(userId)
    } catch (err) {
        response = {
            error: 1,
            status: 404,
            data: 'erreur réseau, impossible de récupérer les commandes'
        }
    }
    return response
}

async function getOrderByUuid(userId, orderUuid) {
    let response;

    try {
        response = await getUserOrderByUuidByLocalSource(userId, orderUuid)
    } catch (err) {
        response = {
            error: -1,
            status: 404,
            data: 'erreur réseau, impossible de récupérer la commande'
        }
    }

    return response
}

async function cancelOrder(userId, orderUuid) {
    const order = await getOrderByUuid(userId, orderUuid);

    if (order.error === -1) {
        return {
            error: -1,
            status: 404,
            data: 'Commande non trouvée'
        }
    }

    return {
        error: 0,
        status: 200,
        data: {
            ...order.data,
            status: 'canceled',
        }
    }
}

async function payOrder(userId, orderUuid, transactionUuid, transactions) {
    const order = await getOrderByUuid(userId, orderUuid);

    if (order.error === -1) {
        return {
            error: -1,
            status: 404,
            data: 'Commande non trouvée'
        }
    }

    const transaction = getTransactionFromNotLocalSource(transactionUuid, transactions);
    console.log(transaction)

    if (transaction.error === -1) {
        return {
            error: -1,
            status: 404,
            data: 'Transaction non trouvée'
        }
    }

    if (transaction.destination !== 'FRSHOP4578901234567890-0000999') return {
        error: -1,
        status: 400,
        data: 'Le compte de destination de la transaction est incorrect'
    }

    if (order.data.total !== -(transaction.amount)) return {
        error: -1,
        status: 400,
        data: 'Le montant de la transaction ne correspond pas au montant de la commande'
    }

    return {
        error: 0,
        status: 200,
        data: {
            ...order.data,
            status: 'finalized',
        }
    }
}

export default {
    payOrder,
    getUserOrders,
    cancelOrder,
}
