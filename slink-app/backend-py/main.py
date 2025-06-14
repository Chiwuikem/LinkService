from fastapi import FastAPI, HTTPException
from fastapi import Request
from fastapi import APIRouter
import traceback
from fastapi.middleware.cors import CORSMiddleware
from models import Location
from db import db_connection

app = FastAPI()

#CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/save-location")
async def save_location(location: Location, request: Request):
    body=await request.body()
    # print("Raw body recieved:", body)
    # print("Parsed Location:", location)
    try:
        print("Parsed Location:", location)
        conn= db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO user_location(user_id, latitude, longitude, location_name)
            VALUES (%s, %s, %s, %s)
            """,
            (location.user_id, location.latitude, location.longitude, location.location_name)
        
        )
        conn.commit()
        cur.close()
        conn.close()
        return{"status": "Location saved sucessfully"}
    except Exception as e:
        #raise HTTPException(status_code=500, detail=str(e))
        print("Exception in save_location:", e)
        print(traceback.format_exc())
        raise e
    #return {"status":"ok"}
