from pydantic import BaseModel

class Location(BaseModel):
    user_sub: str
    latitude: float
    longitude: float
    location_name: str