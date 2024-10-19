import sqlite3

# Connect to SQLite3 database and create a table if it doesn't exist
conn = sqlite3.connect('registrations.db', check_same_thread=False)
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS Registration (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        DateOfBirth TEXT NOT NULL,
        PhoneNumber TEXT,
        Address TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')
conn.commit()
