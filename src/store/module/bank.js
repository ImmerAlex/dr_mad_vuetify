import BankAccountService from '@/services/bankaccount.service'
import router from '@/router/index'

export default {
    namespaced: true,
    state: () => ({
        loggedBankAccount: undefined,
        historiqueLoggedBankAccount: [],
        accountAmount: undefined,
        accountTransactions: [],
        accountError: undefined,
    }),
    mutations: {
        updateAccountAmount(state, accountAmount){
          state.accountAmount = accountAmount;
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
        async getAccountTransactions({commit}, number) {
            console.log('get account transactions');
            let response = await BankAccountService.getAccountTransactions(number)
            if (response.error === 0) {
                commit('updateAccountTransactions', response.data)
                commit('updateAccountError', undefined)
            } else {
                console.log(response.data)
                commit('updateAccountError', -1)
            }
        },
        async getAccountAmount({commit}, number){
            console.log('get account amount');
            let response = await BankAccountService.getAccountAmount(number)
            if (response.error === 0) {
                commit('updateAccountAmount', response.data)
                commit('updateAccountError', undefined)
            } else {
                console.log(response.data)
                commit('updateAccountError', -1)
            }
        },
        async loginToBankAccount({commit,dispatch}, number) {
            let response = await BankAccountService.loginToBankAccount(number);

            if (response.error === 0) {
                commit('updateLoggedBankAccount', response.data);
                commit('updateAccountError', undefined)
                commit('updateHistoriqueLoggedBankAccount', response.data.number);
                await dispatch('getAccountTransactions',number);
                await dispatch('getAccountAmount',number);

                await router.push({name: 'bankSolde'})
            } else {
                console.log(response.data);
                commit('updateAccountError', response.data)
            }
        },
        async createVirment({commit}, amount, dest) {
            console.log('create virment', amount, dest);
            commit('updateAccountError', undefined)
        },
        logoutBankAccount({commit}) {
            commit('logoutBankAccount')
            router.push({name: 'bankLogin'}).then(r => r)
        }
    },
    getters: {
        historiqueLoggedBankAccount: (state) => state.historiqueLoggedBankAccount,
        isLoggedBankAccount: (state) => state.loggedBankAccount !== undefined,
        accountTransactions: (state) => state.accountTransactions,
        loggedBankAccount: (state) => state.loggedBankAccount,
    }
}
