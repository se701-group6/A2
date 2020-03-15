import unittest
import logging
from db_manager import *

class TestDatabaseMethods(unittest.TestCase):
    def test_add_user(self):    
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing adding user")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")
        test_db.add_user("bob", "bobiscool1")
        self.assertEqual(test_db.get_password("bob"), "bobiscool1")
        test_db.delete_db()

    def test_add_duplicate_user(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing adding duplicate user")

        test_db = DatabaseManager()
        test_db.init_db("test.db")
        self.assertTrue(test_db.add_user("bob", "bobiscool1"))
        self.assertFalse(test_db.add_user("bob", "helloworld"))

    def test_add_bill(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing adding bill")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")

        payment1 = {
            "payee" : "bob",
            "amount_owed" : 50,
            "is_paid" : 1
        }

        payment2 = {
            "payee" : "jim",
            "amount_owed" : 45.98,
            "is_paid" : 0
        }
        test_db.add_bill("bob", "maccas", 95.98, (payment1, payment2))
        bills = test_db.get_bills_from_username("bob")
        self.assertEqual(len(bills), 1)
        self.assertEqual(bills[0].bill_id, 1)
        self.assertEqual(bills[0].bill_name, 'maccas')
        self.assertEqual(bills[0].account_username, 'bob')
        self.assertEqual(bills[0].total, 95.98)
        self.assertEqual(bills[0].is_paid, 0)

        specific_bill = test_db.get_bill_from_id(1)
        self.assertEqual(bills[0], specific_bill)
        test_db.delete_db()

    def test_get_payments(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing getting payments")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")

        payment1 = {
            "payee" : "bob",
            "amount_owed" : 50,
            "is_paid" : 1
        }

        payment2 = {
            "payee" : "jim",
            "amount_owed" : 45.98,
            "is_paid" : 0
        }
        test_db.add_bill("bob", "maccas", 95.98, (payment1, payment2))
        payments = test_db.get_payments_from_id(1)
        self.assertListEqual(payments, [Payment(*(1, 'bob', 50.0, 1)), Payment(*(1, 'jim', 45.98, 0))])
        test_db.delete_db()

    def test_pay_bill(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing paying bill")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")

        payment1 = {
            "payee" : "bob",
            "amount_owed" : 50,
            "is_paid" : 1
        }

        payment2 = {
            "payee" : "jim",
            "amount_owed" : 45.98,
            "is_paid" : 0
        }

        payment3 = {
            "payee" : "tom",
            "amount_owed" : 10.00,
            "is_paid" : 0
        }
        test_db.add_bill("bob", "maccas", 105.98, (payment1, payment2, payment3))
        self.assertEqual(test_db.get_bill_from_id(1).is_paid, 0)
        test_db.make_payment(1, "jim")
        self.assertEqual(test_db.get_bill_from_id(1).is_paid, 0)
        test_db.make_payment(1, "tom")
        self.assertEqual(test_db.get_bill_from_id(1).is_paid, 1)
        test_db.delete_db()

if __name__ == '__main__':
    test_db = DatabaseManager()
    test_db.init_db("test.db")
    test_db.delete_db()
    unittest.main(buffer=False)