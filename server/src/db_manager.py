import sqlite3
import os

class DatabaseManager(object):
    def check_db_exists(self):
        """check if a database file already exists"""
        from os.path import isfile

        if not isfile(self.db_name):
            return False
        else: return True

    def init_db(self, filename):
        self.db_name = filename
        if(self.check_db_exists()):
            print("Existing SQL database detected!")
        else:
            print("No SQL database detected! Creating...")
            try:
                conn = sqlite3.connect(self.db_name)
                c = conn.cursor()

                c.execute("""CREATE TABLE `users` (
                            `username`	TEXT NOT NULL,
                            `password`	TEXT NOT NULL,
                            unique (username) on conflict ignore 
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

                
            except Exception as e:
                print(e)
            finally:
                try:
                    conn.close()
                except UnboundLocalError:
                    pass


    def get_password(self, username):
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
        """returns tuple (bill_id, bill_name, account_username, timestamp, total, is_paid)"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from bills where bill_id=?""", (id,))
            bill = c.fetchone()
            return bill
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def get_payments_from_id(self, id):
        """returns tuple (bill_id, payee_name, amount_owed, is_paid)"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from payments where bill_id=?""", (id,))
            payments = c.fetchall()
            return payments
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def get_bills_from_username(self, username):
        """returns list of tuple (bill_id, bill_name, account_username, timestamp, total, is_paid)"""
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""select * from bills where username=?""", (username,))
            bills = c.fetchall()
            return bills
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass


    def add_user(self, username, password):
        conn = sqlite3.connect(self.db_name)
        c = conn.cursor()
        try:
            c.execute("""insert into users
                    (username, password) 
                    values 
                    (?, ?)""", (username, password))
            conn.commit()
        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def add_bill(self, username, bill_name, total, payments):
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

        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass

    def make_payment(self, bill_id, payee):
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

        except Exception as e:
            print(e)
        finally:
            try:
                conn.close()
            except UnboundLocalError:
                pass


    def delete_db(self):
        try:
            os.remove(self.db_name)
        except Except as e:
            print(e)