import sqlite3
import os

class Bill(object):
    def __init__(self,bill_id, bill_name, account_username, timestamp, total, is_paid):
        self.bill_id = bill_id
        self.bill_name = bill_name
        self.account_username = account_username
        self.timestamp = timestamp
        self.total = total
        self.is_paid = is_paid
    def __eq__(self, other):
        if(self.bill_id == other.bill_id and self.bill_name == other.bill_name and self.account_username == other.account_username
            and self.total == other.total and self.is_paid == other.is_paid):
            return True
        else:
            return False
        
class Payment(object):
    def __init__(self, bill_id, payee_name, amount_owed, is_paid):
        self.bill_id = bill_id
        self.payee_name = payee_name
        self.amount_owed = amount_owed
        self.is_paid = is_paid
    
    def __eq__(self, other):
        if(self.bill_id == other.bill_id and self.payee_name == other.payee_name and self.amount_owed == other.amount_owed
            and self.is_paid == other.is_paid):
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

    def init_db(self, filename):
        """
        
        Arguments:
            filename {String} -- name of database file with .db extension
        
        Returns:
            bool -- success or fail
        """        
        self.db_name = filename
        if(self.check_db_exists()):
            print("Existing SQL database detected!")
            return True
        else:
            print("No SQL database detected! Creating...")
            try:
                conn = sqlite3.connect(self.db_name)
                c = conn.cursor()

                c.execute("""CREATE TABLE `users` (
                            `username`	TEXT NOT NULL,
                            `password`	TEXT NOT NULL,
                            unique (username) on conflict abort 
                        );""")

                c.execute("""CREATE TABLE `payments` (
                            `bill_id`	INT NOT NULL,
                            `payee_name`	TEXT NOT NULL,
                            `amount_owed`	float NOT NULL,
                            `is_paid` bit NOT NULL
                        );""")

                c.execute("""CREATE TABLE `bills` (
                            `bill_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                            `name`	TEXT NOT NULL,
                            `username`	TEXT NOT NULL,
                            `timestamp`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            `total`	float NOT NULL,
                            `is_paid` bit NOT NULL
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


    def get_password(self, username):
        """
        Arguments:
            username {string}
        
        Returns:
            string -- password
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select password from users where username=?""", (username,))
            password = c.fetchone()[0]
            return password
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def get_bill_from_id(self, id):
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

    def get_payments_from_id(self, id):
        """
        Arguments:
            id {integer}
        
        Returns:
            list of Payment
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from payments where bill_id=?""", (id,))
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

    def get_bills_from_username(self, username):
        """
        
        Arguments:
            username {String}
        
        Returns:
            list of Bill
        """        
        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from bills where username=?""", (username,))
            bills = c.fetchall()
            list_of_bills = []
            for bill in bills:
                list_of_bills.append(Bill(*bill))
            return list_of_bills
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def add_user(self, username, password):
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
            c.execute("""insert into users
                    (username, password) 
                    values 
                    (?, ?)""", (username, password))
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

    def add_bill(self, username, bill_name, total, payments):
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
                    (name, username, total, is_paid) 
                    values 
                    (?, ?, ?, ?)""", (bill_name, username, total, 0))
            c.execute('SELECT last_insert_rowid()')
            next_id = c.fetchone()
            conn.commit()

            for payment in payments:
                c.execute("""insert into payments
                    (bill_id, payee_name, amount_owed, is_paid) 
                    values 
                    (?, ?, ?, ?)""", (next_id[0], payment["payee"], payment["amount_owed"], payment["is_paid"]))
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

    def make_payment(self, bill_id, payee):
        """
        Arguments:
            bill_id {integer}
            payee {String} -- username of the payee
        
        Returns:
            boolean -- success or fail
        """        
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""update payments
                    set is_paid = ?
                    where bill_id = ? and payee_name = ?""", (1, bill_id, payee))
            conn.commit()
            # check whether this payment was the final payment for this bill
            c.execute("""select is_paid from payments where bill_id = ?""", (bill_id,))
            all_paid_payments = c.fetchall()
            comparison_all_paid = []
            for i in range(len(all_paid_payments)):
                comparison_all_paid.append((1,))

            if(all_paid_payments == comparison_all_paid):
                c.execute("""update bills
                    set is_paid = ?
                    where bill_id = ?""", (1, bill_id))
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
        except Except as e:
            print(e)
            return False