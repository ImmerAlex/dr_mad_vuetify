import LocalSource from "@/datasource/controller";

async function getUserOrdersFromLocalSource(userId) {
    return LocalSource.getUserOrders(userId)
}

// async function getAccountOrdersFromLocalSource(accountNumber) {
//     return LocalSource.getAccountTransactions(accountNumber)
// }

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

async function getUserOrderById(userId, orderId) {
    const userOrders = getUserOrders(userId);
    const order = userOrders.find(order => order.uuid === orderId);

    if (!order) {
        return {
            error: 1,
            status: 404,
            data: 'Commande non trouvé'
        }
    }

    // Retourner la commande de l'utilisateur
    return {
        error: 0,
        status: 200,
        data: order || [] // Si user.orders n'existe pas, retourner un tableau vide
    }
}

async function payOrder(userId, orderId, transactionId, accountNumber) {
    console.log(userId, orderId, transactionId, accountNumber)

    return {
        error: 1,
        status: 404,
        data: 'La commande n\'existe pas ou ne vous appartient pas'
    }

    // // 1. D'abord récupérer les commandes de l'utilisateur
    // const userOrdersResponse = await getUserOrdersFromLocalSource(userId)
    //
    // if (userOrdersResponse.error !== 0) {
    //     return {
    //         error: 1,
    //         status: userOrdersResponse.status,
    //         data: 'Impossible de vérifier la commande'
    //     }
    // }
    //
    // console.log(userOrdersResponse.data)
    //
    // // 2. Vérifier si l'orderId correspond à une commande de l'utilisateur
    // const orderExists = userOrdersResponse.data.some(order => order.uuid === orderId)
    //
    // if (!orderExists) {
    //     return {
    //         error: 1,
    //         status: 404,
    //         data: 'La commande n\'existe pas ou ne vous appartient pas'
    //     }
    // }
    //
    // // 3. Verifier si la transaction est valide
    // const userTransactionsResponse = getAccountOrdersFromLocalSource(accountNumber);
    //
    // if (userTransactionsResponse.error) {
    //     return {
    //         error: 1,
    //         status: userOrdersResponse.status,
    //         data: 'Impossible de vérifier la transaction'
    //     }
    // }
    //
    // const transactionExists = userTransactionsResponse.data.some(t => t.uuid === transactionId);
    //
    // if (!transactionExists) {
    //     return {
    //         error: 1,
    //         status: userOrdersResponse.status,
    //         data: "Cette transaction n'existe pas ou ne vous appartient pas"
    //     }
    // }
    //
    // return {
    //     error: 0,
    //     status: 200,
    //     data: userTransactionsResponse,
    // }

}

export default {
    payOrder,
    getUserOrders,
    getUserOrderById,
}
