import api.account
import api.pay_exec
import api.bill_data
import api.bill_exec

class BaseApi(object):
    def __init__(self):
        self.account = api.account.AccountApi()
        self.bill_data = api.bill_data.BillDataApi()
        self.pay_exec = api.pay_exec.PayExecApi()
        self.bill_exec = api.bill_exec.BillExecApi()
