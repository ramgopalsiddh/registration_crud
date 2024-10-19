import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to access backend via CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Pydantic model for request validation
class Registration(BaseModel):
    name: str
    email: str
    dob: str
    phone: str = None
    address: str = None

# route for create a new registration
@app.post("/register")
def create_registration(reg: Registration):
    try:
        cursor.execute('''
            INSERT INTO Registration (Name, Email, DateOfBirth, PhoneNumber, Address)
            VALUES (?, ?, ?, ?, ?)
        ''', (reg.name, reg.email, reg.dob, reg.phone, reg.address))
        conn.commit()
        return {"message": "Registration created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")

# route for read a single registration by ID
@app.get("/register/{id}")
def read_registration(id: int):
    cursor.execute("SELECT * FROM Registration WHERE ID = ?", (id,))
    result = cursor.fetchone()
    if not result:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {
        "ID": result[0],
        "Name": result[1],
        "Email": result[2],
        "DateOfBirth": result[3],
        "PhoneNumber": result[4],
        "Address": result[5],
        "CreatedAt": result[6]
    }

# route for fetch all registrations
@app.get("/registers")
def fetch_registrations():
    cursor.execute("SELECT * FROM Registration")
    registrations = cursor.fetchall()
    return [
        {
            "ID": reg[0],
            "Name": reg[1],
            "Email": reg[2],
            "DateOfBirth": reg[3],
            "PhoneNumber": reg[4],
            "Address": reg[5],
            "CreatedAt": reg[6]
        }
        for reg in registrations
    ]

# route for update a registration by ID
@app.put("/register/{id}")
def update_registration(id: int, reg: Registration):
    cursor.execute('''
    UPDATE Registration
    SET Name = ?, Email = ?, DateOfBirth = ?, PhoneNumber = ?, Address = ?
    WHERE ID = ?
    ''', (reg.name, reg.email, reg.dob, reg.phone, reg.address, id))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Registration updated successfully"}

# route for Delete a registration by ID
@app.delete("/register/{id}")
def delete_registration(id: int):
    cursor.execute("DELETE FROM Registration WHERE ID = ?", (id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Registration not found")
    return {"message": "Registration deleted successfully"}
