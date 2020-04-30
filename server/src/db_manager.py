import sqlite3
import os
import hashlib
import binascii
from typing import List

class Bill(object):
    def __init__(self,bill_id : int, title : str, creator_username : str, timestamp, total : float, payer : str):
        self.bill_id = bill_id
        self.title = title
        self.creator_username = creator_username
        self.timestamp = timestamp
        self.total = total
        self.payer = payer
        self.payments = []
    def __eq__(self, other):
        if(self.bill_id == other.bill_id and self.title == other.title and self.creator_username == other.creator_username
            and self.total == other.total and self.payer == other.payer):
            return True
        else:
            return False
        
class Payment(object):
    def __init__(self, payee_name : str, amount_owed : float, is_paid : bool, payment_id : int):
        self.payee_name = payee_name
        self.amount_owed = amount_owed
        self.is_paid = is_paid
        self.payment_id = payment_id
    def __eq__(self, other):
        if(self.payee_name == other.payee_name and self.amount_owed == other.amount_owed
            and self.is_paid == other.is_paid and self.payment_id == other.payment_id):
            return True
        else:
            return False

class DatabaseManager(object):
    def check_db_exists(self):
        """check if a database file already exists"""
        from os.path import isfile

        if not isfile(self.db_name):
            return False
        else: return True

    def migrate_passwords_to_hash(self):
        try:
            conn = sqlite3.connect(self.db_name)
            c = conn.cursor()

            c.execute("SELECT COUNT(*) FROM (SELECT 1 FROM PRAGMA_TABLE_INFO('users') WHERE name = 'password')")
            password_col_present = bool(c.fetchone()[0])

            if password_col_present:
                print("Found passwords that are not hashed, migrating to hashed passwords")
                c.execute("SELECT username, password FROM `users`")
                username_to_passwords = { x[0]: x[1] for x in c.fetchall() }
                c.execute("DROP TABLE `users`")
                c.execute("""CREATE TABLE `users` (
                    `username` TEXT NOT NULL,
                    `password_hash` TEXT NOT NULL,
                    `password_salt` TEXT NOT NULL,
                    UNIQUE(username) ON CONFLICT ABORT
                )
                """)

                for k, v in username_to_passwords.items():
                    self.add_user(k, v)
        except Exception as e:
            print(e)
        finally:
            try: 
                conn.close()
            except UnboundLocalError:
                pass
    
    def hash_password(self, password):
        password_salt = hashlib.sha256(os.urandom(60)).hexdigest()
        password_hash = hashlib.scrypt(password.encode('utf-8'), salt=password_salt.encode('ascii'), n=1024, r=8, p=1)
        return (binascii.hexlify(password_hash).decode('ascii'), password_salt)
    
    def password_hash_matches(self, password, password_hash, password_salt):
        return binascii.hexlify(hashlib.scrypt(password.encode('utf-8'), salt=password_salt.encode('ascii'), n=1024, r=8, p=1)).decode('ascii') == password_hash


    def init_db(self, filename : str):
        """
        
        Arguments:
            filename {String} -- name of database file with .db extension
        
        Returns:
            bool -- success or fail
        """        
        self.db_name = filename
        if(self.check_db_exists()):
            print("Existing SQL database detected!")
            self.migrate_passwords_to_hash()
            return True
        else:
            print("No SQL database detected! Creating...")
            try:
                conn = sqlite3.connect(self.db_name)
                c = conn.cursor()

                c.execute("""CREATE TABLE `users` (
                            `username`	TEXT NOT NULL,
                            `password_hash` TEXT NOT NULL,
                            `password_salt` TEXT NOT NULL,
                            unique (username) on conflict abort 
                        );""")

                c.execute("""CREATE TABLE `payments` (
                            `bill_id`	INT NOT NULL,
                            `payee_name`	TEXT NOT NULL,
                            `amount_owed`	float NOT NULL,
                            `is_paid` bit NOT NULL,
                            `payment_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
                        );""")

                c.execute("""CREATE TABLE `bills` (
                            `bill_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            `title`	TEXT NOT NULL,
                            `creator_username`	TEXT NOT NULL,
                            `timestamp`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            `total`	float NOT NULL,
                            `payer` TEXT NOT NULL
                        );""")
                return True
                
            except Exception as e:
                print(e)
                return False
            finally:
                try:
                    conn.close()
                except UnboundLocalError:
                    pass

    def password_is_correct(self, username : str, password : str):
        """
        Arguments:
            username {string}
            password {string}
        
        Returns:
            bool -- whether the password is correct for the given user
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select password_hash, password_salt from users where username=?""", (username,))
            hash_and_salt = c.fetchone()
            return self.password_hash_matches(password, hash_and_salt[0], hash_and_salt[1])
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def get_bill_from_id(self, id : int):
        """
        Arguments:
            id {integer} -- unique bill id
        
        Returns:
            Bill
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from bills where bill_id=?""", (id,))
            bill = c.fetchone()
            return Bill(*bill)
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass
    
    def get_payment_from_id(self, id : int):
            """
            Arguments:
                id {integer} -- unique payment id
            
            Returns:
                Payment
            """        
            conn = sqlite3.connect(self.db_name)
            c = conn.cursor()
            try:
                c.execute("""select payee_name, amount_owed, is_paid, payment_id from payments where payment_id=?""", (id,))
                payment = c.fetchone()
                return Payment(*payment)
            except Exception as e:
                print(e)
            finally:
                try:
                    conn.close()
                except UnboundLocalError:
                    pass
                
    def get_payments_from_bill_id(self, id : int):
        """
        Arguments:
            id {integer}
        
        Returns:
            list of Payment
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select payee_name, amount_owed, is_paid, payment_id from payments where bill_id=?""", (id,))
            payments = c.fetchall()

            list_of_payments = []
            for payment in payments:
                list_of_payments.append(Payment(*payment))

            return list_of_payments
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def get_bills_from_username(self, username : str):
        """
        
        Arguments:
            username {String}
        
        Returns:
            list of Bill
        """        
        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from bills where creator_username=?""", (username,))
            bills = c.fetchall()
            list_of_bills = []
            for bill in bills:
                tmpBill = Bill(*bill)
                tmpBill.payments = self.get_payments_from_bill_id(tmpBill.bill_id)
                list_of_bills.append(tmpBill)
            return list_of_bills
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def add_user(self, username : str, password : str):
        """
        Arguments:
            username {String} 
            password {String} 
        
        Returns:
            boolean -- success or fail
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            (password_hash, password_salt) = self.hash_password(password)
            c.execute("""insert into users
                    (username, password_hash, password_salt) 
                    values 
                    (?, ?, ?)""", (username, password_hash, password_salt))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def add_bill(self, payer : str, creator_username : str, title : str, total : float, payments: List[Payment]):
        """
        Arguments:
            username {String}
            bill_name {String}
            total {Integer}
            payments {List of tuple} -- (bill_id, payee_name, amount_owed, is_paid)
        
        Returns:
            boolean -- success or fail
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""insert into bills
                    (title, creator_username, total, payer) 
                    values 
                    (?, ?, ?, ?)""", (title, creator_username, total, payer))
            c.execute('SELECT last_insert_rowid()')
            next_id = c.fetchone()
            conn.commit()

            for payment in payments:
                c.execute("""insert into payments
                    (bill_id, payee_name, amount_owed, is_paid) 
                    values 
                    (?, ?, ?, ?)""", (next_id[0], payment.payee_name, payment.amount_owed, payment.is_paid))
                conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass


    
    def edit_bill(self, bill_id : float, payer : str, creator_username : str, title : str, total : float, payments: List[Payment]):
        """
        Arguments:
            bill_id {Integer}
            username {String}
            bill_name {String}
            total {Integer} 
            payments {List of tuple} -- (bill_id, payee_name, amount_owed, is_paid)
        
        Returns:
            boolean -- success or fail
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            ''' Update bill details '''
            c.execute("""UPDATE bills
                    SET title=?, creator_username=?, total=?, payer=?
                    WHERE bill_id=?""", (title, creator_username, total, payer, bill_id))
            conn.commit()

            ''' Update existing payment details '''
            print("Updating payers") 
            payment_details = self.get_payments_from_bill_id(bill_id)
            x = min(len(payments),len(payment_details) )
            for i in range(x):
                payment = payments[i]
                c.execute("""UPDATE payments
                    SET bill_id=?, payee_name=?, amount_owed=?, is_paid=?
                    WHERE payment_id=?""", (bill_id,payment.payee_name, payment.amount_owed, payment.is_paid,payment_details[i].payment_id))
                conn.commit()
                
            ''' Add any new payers ''' 
            print("Adding payers") 
            if (len(payments)>len(payment_details)):
                indicies = range(len(payment_details), len(payments))
                for i in indicies:
                    payment = payments[i]
                    c.execute("""insert into payments
                        (bill_id, payee_name, amount_owed, is_paid) 
                        values 
                        (?, ?, ?, ?)""", (bill_id, payment.payee_name, payment.amount_owed, payment.is_paid))
                    conn.commit()  
                    
            ''' Delete any removed payers '''      
            print("Deleting payers") 
            if (len(payments)<len(payment_details)):    
                indicies = range(len(payments), len(payment_details))
                for i in indicies:
                    payment = payment_details[i]
                    c.execute("""delete from payments
                        WHERE payment_id=?""", (payment.payment_id,))
                    conn.commit()                           
                         
            return True
        except Exception as e:
            print("Error:",e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass
    


    def make_payment(self, payment_id : int, done : bool):
        """
        Arguments:
            payment_id {integer}
            payee {String} -- username of the payee
        
        Returns:
            boolean -- success or fail
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""update payments
                    set is_paid = ?
                    where payment_id = ?""", (done, payment_id))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass


    def delete_db(self):
        """
        Returns:
            boolean -- success or fail
        """        
        try:
            os.remove(self.db_name)
            return True
        except Exception as e:
            print(e)
            return False
        
    def create_test_data(self):
        if self.add_user("Bob", "password"):
            self.add_user("Bil", "password")
            payment1 = Payment("Jim", 45.98, False, 0)
            payment2 = Payment("Tom", 10.00, False, 0)
            self.add_bill("Bob", "Bob", "maccas", 105.98, [payment1, payment2])

    def delete_bill(self, bill_id : int):
        """
        Arguments:
            bill_id {Integer}

        Returns:
            boolean -- success or fail
        """
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""DELETE FROM bills
                    WHERE 
                    bill_id = ?""", [bill_id])
            conn.commit()
        except Exception as e:
            print(e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def check_if_user_owns_bill(self, username : str, bill_id : int):
        """
        Arguments:
            username {String}
            bill_id {Integer}

        Returns:
            boolean -- success or fail
        """
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""SELECT * FROM bills
                    WHERE 
                    bill_id = ?""", [bill_id])
            data = c.fetchone()
            requested_by = data[2]
            if (requested_by == username):
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return False
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass
