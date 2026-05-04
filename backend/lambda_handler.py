"""Entry point for AWS Lambda.

Wraps the FastAPI app with Mangum so a Lambda Function URL can invoke it
as a standard ASGI app. Set the Lambda handler to ``lambda_handler.handler``.
"""

from mangum import Mangum

from main import app

handler = Mangum(app, lifespan="off")
