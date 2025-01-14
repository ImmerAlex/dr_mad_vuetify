import BankAccountService from '@/services/bankaccount.service'

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
        updateAccountAmount(state, amount) {
            state.accountAmount = amount
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
        // async getAccountAmount({commit}, number) {
        //     console.log('get account amount');
        //     let response = await BankAccountService.getAccountAmount(number)
        //     if (response.error === 0) {
        //         commit('updateAccountAmount', response.data)
        //         commit('updateAccountError', undefined)
        //     } else {
        //         console.log(response.data)
        //         commit('updateAccountError', response.data)
        //     }
        // },
        // async getAccountTransactions({commit}, number) {
        //     console.log('get account transactions');
        //     let response = await BankAccountService.getAccountTransactions(number)
        //     if (response.error === 0) {
        //         commit('updateAccountTransactions', response.data)
        //         commit('updateAccountError', undefined)
        //     } else {
        //         console.log(response.data)
        //         commit('updateAccountError', -1)
        //     }
        // },
        async loginToBankAccount({commit}, number) {
            console.log('get bank account from account number');
            let response = await BankAccountService.loginToBankAccount(number);

            if (response.error === 0) {
                commit('updateLoggedBankAccount', response.data);
                commit('updateAccountError', undefined)
                commit('updateHistoriqueLoggedBankAccount', response.data.number);
            } else {
                console.log(response.data);
                commit('updateAccountError', response.data)
            }
        },
        logoutBankAccount({commit}) {
            commit('logoutBankAccount')
        }
    },
    getters: {
        historiqueLoggedBankAccount: state => {
            return state.historiqueLoggedBankAccount
        },
    }
}