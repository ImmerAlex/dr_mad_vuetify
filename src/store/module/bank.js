import BankAccountService from '@/services/bankaccount.service'
import { v4 as uuidv4 } from 'uuid';
import router from '@/router/index'

export default {
    namespaced: true,
    state: () => ({
        loggedBankAccount: undefined,
        historiqueLoggedBankAccount: [],
        accountAmount: undefined,
        accountTransactions: [],
        transactions: [],
        accountError: undefined,
        transactionsError: undefined,
    }),
    mutations: {
        updateAccountAmount(state, accountAmount) {
            state.accountAmount = accountAmount;
        },
        updateTransactions(state, transactions) {
            state.transactions = transactions;
        },
        updateLoggedBankAccount(state, bankAccount) {
            state.loggedBankAccount = bankAccount
        },
        updateHistoriqueLoggedBankAccount(state, bankAccount) {
            let index = state.historiqueLoggedBankAccount.indexOf(bankAccount)
            if (index !== -1) {
                state.historiqueLoggedBankAccount.splice(index, 1)
            }
            state.historiqueLoggedBankAccount.unshift(bankAccount)
        },
        updateAccountTransactions(state, transactions) {
            state.accountTransactions = transactions
        },
        updateAccountError(state, error) {
            state.accountError = error
        },
        logoutBankAccount(state) {
            state.loggedBankAccount = undefined
            state.accountAmount = undefined
            state.accountTransactions = []
            state.accountError = undefined
        }
    },
    actions: {
        async getAllTransactions({ commit }) {
            let response = await BankAccountService.getAllTransactions()
            if (response.error === 0) {
                commit('updateTransactions', response.data)
            } else {
                commit('updateTransactionsError', -1)
            }
        },
        async getAccountTransactions({ commit, state }) {
            let id = state.loggedBankAccount._id;
            commit('updateAccountTransactions', state.transactions.filter(t => t.account === id))
        },
        async getAccountAmount({ commit }, number) {
            let response = await BankAccountService.getAccountAmount(number)
            if (response.error === 0) {
                commit('updateAccountAmount', response.data)
                commit('updateAccountError', {error: 0, message: 'Solde récupéré'})
            } else {
                commit('updateAccountError', {error: -1, message: response.data})
            }
        },
        async loginToBankAccount({ commit, dispatch, state }, number) {
            let response = await BankAccountService.loginToBankAccount(number);

            if (response.error === 0) {
                commit('updateLoggedBankAccount', response.data);
                commit('updateAccountError', undefined)
                commit('updateHistoriqueLoggedBankAccount', response.data.number);
                await dispatch('getAccountAmount', number);
                if (state.transactions.length === 0) {
                    await dispatch('getAllTransactions');
                }
                await dispatch('getAccountTransactions');

                await router.push({ name: 'bankSolde' })
            } else {
                commit('updateAccountError', response.data)
            }
        },
        async createWithdraw({ commit, state, dispatch }, data) {
            // Vérifier si le compte existe
            let accountResponse = await BankAccountService.getTransactionFromId(data.idAccount);
            if (accountResponse.error !== 0) {
                commit('updateAccountError', {
                    error: -1,
                    message: "id de compte invalide"
                });
                return;
            }

            // Vérifier si le solde est suffisant
            if (state.accountAmount < data.amount) {
                commit('updateAccountError', {
                    error: -1,
                    message: "Solde insuffisant pour effectuer cette opération"
                });
                return;
            }

            // Créer la transaction de retrait
            const transaction = {
                uuid: uuidv4(),
                _id: uuidv4(),
                date: {
                    $date: new Date().toISOString(),
                },
                amount: -(data.amount),
                account: data.idAccount,
            };

            // Mettre à jour le state directement
            const newAmount = state.accountAmount - data.amount;
            commit('updateAccountAmount', newAmount);
            commit('updateTransactions', [transaction, ...state.transactions]);

            commit('updateAccountError', {
                error: 0,
                message: "Transaction créée avec succès, uuid de transaction : " + transaction._id
            });

            await dispatch('getAccountTransactions');
            return {
                error: 0,
                data: {
                    uuid: transaction._id,
                    amount: newAmount
                }
            };
        },

        async createPayment({ commit, state, dispatch }, data) {
            console.log(data)
            // Vérifier si le compte destinataire existe
            let destAccount = await BankAccountService.loginToBankAccount(data.destNumber);

            if (destAccount.error !== 0) {
                commit('updateAccountError', {
                    error: -1,
                    message: "compte destinataire inexistant"
                });
                return;
            }

            // Vérifier si le solde est suffisant
            if (state.accountAmount < data.amount) {
                commit('updateAccountError', {
                    error: -1,
                    message: "Solde insuffisant pour effectuer cette opération"
                });
                return;
            }

            // Créer le retrait sur le compte source
            const withdrawTransaction = {
                uuid: uuidv4(),
                _id: uuidv4(),
                date: {
                    $date: new Date().toISOString(),
                },
                amount: -(data.amount),
                account: data.idAccount,
                destination: data.destNumber,
            };

            // Créer le dépôt sur le compte destinataire
            const depositTransaction = {
                _id: uuidv4(),
                date: {
                    $date: new Date().toISOString(),
                },
                amount: data.amount,
                account: destAccount.data._id,
            };

            // Mettre à jour le state avec les deux transactions
            const newAmount = state.accountAmount - data.amount;
            commit('updateAccountAmount', newAmount);
            commit('updateTransactions', [withdrawTransaction, depositTransaction, ...state.transactions]);

            commit('updateAccountError', {
                error: 0,
                message: "Virement effectué avec succès. ID de transaction : " + withdrawTransaction._id
            });

            await dispatch('getAccountTransactions');
            return {
                error: 0,
                data: {
                    withdrawId: withdrawTransaction._id,
                    depositId: depositTransaction._id,
                    amount: newAmount
                }
            };
        },
        logoutBankAccount({ commit }) {
            commit('logoutBankAccount')
            router.push({ name: 'bankLogin' }).then(r => r)
        }
    },
    getters: {
        historiqueLoggedBankAccount: (state) => state.historiqueLoggedBankAccount,
        isLoggedBankAccount: (state) => state.loggedBankAccount !== undefined,
        accountTransactions: (state) => state.accountTransactions,
        loggedBankAccount: (state) => state.loggedBankAccount,
        transactions: (state) => state.transactions,
    }
}
