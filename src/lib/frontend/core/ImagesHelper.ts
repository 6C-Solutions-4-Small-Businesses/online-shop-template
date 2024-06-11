const createImage = (url: string): Promise<HTMLImageElement | undefined> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.src = url
    })

export async function getCroppedImage(imageSrc: string, pixelCrop: { x: number, y: number, width: number, height: number }) {
    const image = await createImage(imageSrc)
    if (!image) {
        return
    }
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const context = canvas.getContext('2d')

    if (context) {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        )
    }

    return canvas.toDataURL('image/jpeg')
}

