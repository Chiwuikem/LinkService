from fastapi import FastAPI, HTTPException
from models import Location
from db import db_connection

app = FastAPI()

@app.post("/save-location")
def save_location(location: Location):
    try:
        conn= db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO user_location(user_id, latitude, longitude, location_name)
            VALUES (%s, %s, %s, %s)
            """,
            (location.user_sub, location.latitude, location.longitude, location.location_name)
        
        )
        conn.commit()
        cur.close()
        conn.close()
        return{"message": "Location saved sucessfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
