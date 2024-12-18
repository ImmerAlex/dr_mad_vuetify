import LocalSource from "@/datasource/controller";

async function getUserOrdersFromLocalSource(userId) {
  return LocalSource.getUserOrders(userId)
}

// TODO: implémenter cette fonction
async function payOrderFromLocalSource() {
  return { error: 0}
}

async function getUserOrders(userId) {
  let response;
  try {
    response = await getUserOrdersFromLocalSource(userId)
  } catch(err) {
    response = {
      error: 1, 
      status: 404, 
      data: 'erreur réseau, impossible de récupérer les commandes'
    }
  }
  return response
}

async function payOrder(orderId) {
  try {
    // 1. D'abord récupérer les commandes de l'utilisateur
    //TODO: récupérer correctement l'user loggé
    const userOrdersResponse = await getUserOrdersFromLocalSource("66d58122c08b4d64db14cd04")
    
    if (userOrdersResponse.error) {
      return {
        error: 1,
        status: userOrdersResponse.status,
        data: 'Impossible de vérifier la commande'
      }
    }

    // 2. Vérifier si l'orderId correspond à une commande de l'utilisateur
    const orderExists = userOrdersResponse.data.some(order => order.uuid === orderId)
    
    if (!orderExists) {
      return {
        error: 1,
        status: 404,
        data: 'Cette commande n\'existe pas ou ne vous appartient pas'
      }
    }

    // 3. Si la commande existe, on la finalise
    const response = await payOrderFromLocalSource()
    
    return response

  } catch(err) {
    return {
      error: 1,
      status: 500,
      data: 'Une erreur est survenue lors du paiement'
    }
  }
}

export default{
  payOrder,
  getUserOrders,
}
