from fastapi import HTTPException, status


class EmailAlreadyRegisteredError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )


class CredentialsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


class ProjectNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )


class BlueprintNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blueprint not found",
        )


class AIGenerationError(HTTPException):
    def __init__(self, detail: str = "The AI service could not generate a blueprint") -> None:
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
        )


class AIGenerationUnavailableError(AIGenerationError):
    def __init__(self) -> None:
        super().__init__(
            "Gemini API key not configured.",
        )


class BlueprintValidationError(AIGenerationError):
    def __init__(self) -> None:
        super().__init__(
            "The AI returned an unexpected format. Please try again.",
        )


class DiagramNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found",
        )


class DiagramGenerationError(AIGenerationError):
    def __init__(self) -> None:
        super().__init__(
            "We couldn't generate the diagram. Please try again.",
        )
