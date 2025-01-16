import LocalSource from "@/datasource/controller";

async function getUserOrdersFromLocalSource(userId) {
    return LocalSource.getUserOrders(userId)
}

async function getUserOrderByUuidByLocalSource(userId, orderUuid) {
    return LocalSource.getUserOrderByUuid(userId, orderUuid)
}

async function getTransactionFromLocalSource(transactionUuid) {
    return LocalSource.getTransaction(transactionUuid)
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

async function payOrder(userId, orderUuid, transactionUuid) {
    const order = await getOrderByUuid(userId, orderUuid);

    if (order.error === -1) {
        return {
            error: -1,
            status: 404,
            data: 'Commande non trouvée'
        }
    }

    const transaction = await getTransactionFromLocalSource(transactionUuid);

    if (transaction.error === -1) {
        return {
            error: -1,
            status: 404,
            data: 'Transaction non trouvée'
        }
    }

    if (order.data.total !== transaction.data.amount) {
        return {
            error: -1,
            status: 400,
            data: 'Le montant de la transaction ne correspond pas au montant de la commande'
        }
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
}
