from pydantic import BaseModel

class Location(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    location_name: str