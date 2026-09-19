from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def health_check():
    return {'status': 'success', 'message': 'API is healthy'}
