from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

# Common dependencies can be declared here
DBDep = Depends(get_db)
