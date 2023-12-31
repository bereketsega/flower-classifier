
from fastapi import FastAPI,  File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = ["*"]

app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("../models/1")

CLASS_NAMES=['bougainvillea',
 'daisies',
 'garden_roses',
 'gardenias',
 'hibiscus',
 'hydrangeas',
 'lilies',
 'orchids',
 'peonies',
 'tulips']

@app.get("/")
async def ping():
    return "flower-classifier api is live!"

def read_file_as_image(data) -> np.ndarray:
    img = Image.open(BytesIO(data))
    # resize the image to 256x256
    img = img.resize((256, 256))
    image = np.array(img)
    return image

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)
