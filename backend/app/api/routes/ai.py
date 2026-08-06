from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.services import ai_service
from app.utils.exceptions import AIGenerationError

router = APIRouter(prefix="/ai", tags=["AI"])


@router.get("/test")
def test_ai_connection(current_user: CurrentUser):
    result = ai_service.test_ai_connection()
    if not result["ok"]:
        raise AIGenerationError(result["error"])
    return result
