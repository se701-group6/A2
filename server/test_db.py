import unittest
import logging
from src.db_manager import *

class TestDatabaseMethods(unittest.TestCase):
    def test_add_user(self):    
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing adding user")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")
        test_db.add_user("bob", "bobiscool1")
        self.assertTrue(test_db.password_is_correct("bob", "bobiscool1"))
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

        payment1 = Payment("Bob", 50, True, 0)

        payment2 = Payment("Jim", 45.98, False, 0)
        
        test_db.add_bill("Bob", "Steve", "maccas", 95.98, [payment1, payment2])
        bills = test_db.get_bills_from_username("Steve")
        self.assertEqual(len(bills), 1)
        self.assertEqual(bills[0].bill_id, 1)
        self.assertEqual(bills[0].title, 'maccas')
        self.assertEqual(bills[0].creator_username, 'Steve')
        self.assertEqual(bills[0].total, 95.98)

        specific_bill = test_db.get_bill_from_id(1)
        self.assertEqual(bills[0], specific_bill)
        test_db.delete_db()



    def test_get_payments(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing getting payments")
        
        test_db = DatabaseManager()
        test_db.init_db("test.db")

        payment1 = Payment("Bob", 50, True, 0)
        
        payment2 = Payment("Jim", 45.98, False, 0)
        
        test_db.add_bill("Bob", "Bob", "maccas", 95.98, [payment1, payment2])
        payments = test_db.get_bills_from_username("Bob")[0].payments
        self.assertListEqual(payments, [Payment(*('Bob', 50.0, True, 1)), Payment(*('Jim', 45.98, False, 2))])
        test_db.delete_db()

    def test_pay_bill(self):
        logging.basicConfig()
        log = logging.getLogger("LOG")
        log.warning("Testing paying bill")
        test_db = DatabaseManager()
        test_db.init_db("test.db")
        payment1 = Payment("bob", 50, False, 0)  
        payment2 = Payment("jim", 45.98, False, 0)
        payment3 = Payment("tom", 10.00, False, 0)
        test_db.add_bill("bob", "bob", "maccas", 105.98, [payment1, payment2, payment3])
        payments = test_db.get_bills_from_username("bob")[0].payments
        
        self.assertEqual(test_db.get_payment_from_id(payments[0].payment_id).is_paid, 0)
        
        test_db.make_payment(2, True)
        test_db.make_payment(3, True)
        self.assertEqual(test_db.get_payment_from_id(payments[0].payment_id).is_paid, 0)
        test_db.make_payment(1, True)
        self.assertEqual(test_db.get_payment_from_id(payments[0].payment_id).is_paid, 1)
        test_db.delete_db()

if __name__ == '__main__':
    test_db = DatabaseManager()
    test_db.init_db("test.db")
    test_db.delete_db()
    unittest.main(buffer=False)