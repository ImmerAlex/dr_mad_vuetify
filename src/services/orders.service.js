import LocalSource from "@/datasource/controller";

async function getUserOrdersFromLocalSource(userId) {
    return LocalSource.getUserOrders(userId)
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

async function payOrder() {

    return {
        error: 0,
        status: 404,
        data: 'La commande n\'existe pas ou ne vous appartient pas'
    }
}

export default {
    payOrder,
    getUserOrders,
    getUserOrderById,
}
