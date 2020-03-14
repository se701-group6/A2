import api.account
import api.pay_exec
import api.bill_data
import api.bill_exec

class BaseApi(object):
    def __init__(self, database):
        self.database = database
        self.account = api.account.AccountApi(database)
        self.bill_data = api.bill_data.BillDataApi(database)
        self.pay_exec = api.pay_exec.PayExecApi(database)
        self.bill_exec = api.bill_exec.BillExecApi(database)
