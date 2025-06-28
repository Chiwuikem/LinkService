from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import db_connection
import traceback

router = APIRouter(prefix="/user", tags=["user"])

class UserOut(BaseModel):
    user_id: str         # UUID in string form
    username: str
    first_name: str = None
    last_name: str = None
    email: str = None
    phone_number: str = None

@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: str):
    """
    Given a user's UUID, return their profile fields.
    """
    try:
        conn = db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              user_id,
              username,
              first_name,
              last_name,
              email,
              phone_number
            FROM users
            WHERE user_id = %s
            LIMIT 1;
            """,
            (user_id,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        # Map columns into our Pydantic schema
        return UserOut(
            user_id=str(row[0]),
            username=row[1],
            first_name=row[2],
            last_name=row[3],
            email=row[4],
            phone_number=row[5]
        )
    except HTTPException:
        raise
    except Exception as e:
        print("Error in get_user_by_id:", e)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
