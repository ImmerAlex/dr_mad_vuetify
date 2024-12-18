import {bankaccounts, items, shopusers, transactions} from './data'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'

function loginUser(data) {
  if ((!data.login) || (!data.password)) return {error: 1, status: 404, data: 'aucun login/pass fourni'}

  // pour simplifier : test uniquement le login
  let user = shopusers.find(e => e.login === data.login && bcrypt.compareSync(data.password, e.password));

  if (!user) return { error: 1, status: 404, data: 'login/pass incorrect' }

  // générer un uuid de session pour l'utilisateur si non existant
  if (!user.session) {
    user.session = uuidv4()
  }

  // retourne uniquement les champs nécessaires
  let u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session
  }

  return { error: 0, status: 200, data: u }
}

function getAllViruses() {
  return {error: 0, data: items}
}

function getAccountAmount(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
  return {error: 0, status: 200, data: account.amount}
}

function getAccountTransactions(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}

  let account = bankaccounts.find(a => a.number === number)

  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}

  let trans = transactions.filter(t => t.account === account._id)

  return {error: 0, status: 200, data: trans}
}

function getUserOrders(userId){
  // Trouver l'utilisateur dans la liste des shopusers
  const user = shopusers.find(user => user._id === userId);

  if (!user) {
    return {
      error: 1,
      status: 404,
      data: 'Utilisateur non trouvé'
    }
  }

  // Retourner les commandes de l'utilisateur
  return {
    error: 0,
    status: 200,
    data: user.orders || [] // Si user.orders n'existe pas, retourner un tableau vide
  }
}

export default {
  loginUser,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
  getUserOrders
}
