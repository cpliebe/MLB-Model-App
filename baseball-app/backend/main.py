from fastapi import FastAPI, HTTPException, Request
from starlette.middleware.cors import CORSMiddleware
from datetime import date, datetime, timedelta
import statsapi
import logging

app = FastAPI()
current_date = date.today().strftime("%m/%d/%Y")
yesterday_date = (date.today() - timedelta(days=1)).strftime("%m/%d/%Y")
tomorrow_date = (date.today() + timedelta(days=1)).strftime("%m/%d/%Y")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


# Add CORS middleware to allow requests from all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/today_schedule")
def get_today_schedule():
    today_schedule = statsapi.schedule(date=current_date, sportId=1)
    return today_schedule

@app.get("/yesterday_schedule")
def get_yesterday_schedule():
    yesterday_schedule = statsapi.schedule(date=yesterday_date, sportId=1)
    return yesterday_schedule

@app.get("/tomorrow_schedule")
def get_tomorrow_schedule():
    tomorrow_schedule = statsapi.schedule(date=tomorrow_date, sportId=1)
    return tomorrow_schedule


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)



