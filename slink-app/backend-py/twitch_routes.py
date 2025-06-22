import os
import httpx
from fastapi import Request, APIRouter
from dotenv import load_dotenv

load_dotenv()
router= APIRouter()


Twitch_ClientID=os.getenv("Twitch_ClientID")
Twitch_Secret_Key=os.getenv("Twitch_Secret_Key")
Twitch_Redirect_URI= "http://localhost:3000/twitch/callback"

print("Loaded Twitch_ClientID:", Twitch_ClientID)
print("Loaded Twitch_Secret_Key:", Twitch_Secret_Key)

@router.post("/twitch/exchange-code")
async def exchange_code(request: Request):
    data = await request.json()
    code = data.get("code")
    if not code:
        return{"error": "Missing code"}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://id.twitch.tv/oauth2/token",
            data={
                "client_id": Twitch_ClientID,
                "client_secret": Twitch_Secret_Key,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": Twitch_Redirect_URI,
            },
        )
        response.raise_for_status()
        return response.json()