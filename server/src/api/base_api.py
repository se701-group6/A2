import api.account
import api.transactions
import api.make_transaction
import api.settle_transaction

class BaseApi(object):
    def __init__(self):
        self.account = api.account.AccountApi()
        self.transactions = api.transactions.TransactionsApi()
        self.make_transaction = api.make_transaction.MakeTransactionApi()
        self.settle_transaction = api.settle_transaction.MakeTransactionApi()