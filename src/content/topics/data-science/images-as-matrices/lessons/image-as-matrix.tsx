import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function ImageAsMatrix() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Payoff lesson — you already know the tools">
        Nothing new conceptually: an image is a table of numbers. You will create a tiny grid, look at
        its shape, slice a region, and darken pixels — the same skills as earlier lessons.
      </Callout>

      <Definition term="Images as NumPy arrays">
        <p>
          A digital image is a <strong className="text-white">grid of pixel values</strong>. Grayscale
          images are 2-D arrays (height × width). Color images are often 3-D (height × width × 3 RGB
          channels). That is why computer vision and NumPy feel like the same skill.
        </p>
      </Definition>

      <Callout variant="tip" title="Mental model">
        Each number is brightness (0 = black, 255 = white for typical 8-bit grayscale). Rows go top →
        bottom; columns go left → right — like a spreadsheet of light.
      </Callout>

      <LessonSection title="From pixels to shape">
        <Flowchart
          title="How an image becomes an array"
          chart={`flowchart TB
  A[Picture on screen] --> B[Grid of pixels]
  B --> C[Each pixel = a number]
  C --> D["NumPy array shape (H, W) or (H, W, 3)"]`}
        />
        <ContentStep number={1} title="Grayscale">
          <p className="text-slate-300">
            Shape <code className="font-mono text-sm">(height, width)</code> — one number per pixel.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Color (RGB)">
          <p className="text-slate-300">
            Shape <code className="font-mono text-sm">(height, width, 3)</code> — red, green, blue
            stacked on the last axis.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Notebook — build a tiny ‘image’">
        <div className="space-y-6">
          <NotebookCell
            cell={1}
            title="Create an 8×8 grayscale gradient"
            code={`import numpy as np

img = np.linspace(0, 255, 64, dtype=np.uint8).reshape(8, 8)
img[2:6, 2:6] = 220  # bright square in the middle
print(img.shape)
print(img.dtype)
print(img)`}
            output={`(8, 8)
uint8
[[  0   4   8  12  16  20  24  28]
 [ 32  36  40  44  48  52  56  60]
 [ 64  68 220 220 220 220  89  93]
 [ 97 101 220 220 220 220 121 125]
 [129 133 220 220 220 220 153 157]
 [161 165 220 220 220 220 186 190]
 [194 198 202 206 210 214 218 222]
 [226 230 234 238 242 246 250 255]]`}
            imageSrc="/content/data-science/numpy-image-matrix.png"
            imageAlt="Side-by-side view of an 8x8 grayscale image and the same pixel values as numbers"
          >
            <p>
              Left: how it looks as an image. Right: the same matrix of numbers — slicing{' '}
              <code className="font-mono text-xs">img[2:6, 2:6]</code> painted the bright square.
            </p>
          </NotebookCell>

          <NotebookCell
            cell={2}
            title="Slice a region (crop)"
            code={`crop = img[2:6, 2:6]
print(crop)
print("crop mean brightness:", crop.mean())`}
            output={`[[220 220 220 220]
 [220 220 220 220]
 [220 220 220 220]
 [220 220 220 220]]
crop mean brightness: 220.0`}
          />

          <NotebookCell
            cell={3}
            title="Simple filter — darken everything"
            code={`darker = (img * 0.5).astype(np.uint8)
print(darker[0, :4])
print(darker[2, 2])  # square is dimmer too`}
            output={`[0 2 4 6]
110`}
          />

          <NotebookCell
            cell={4}
            title="Color image shape (concept)"
            code={`# Fake RGB: three copies of grayscale stacked as channels
rgb = np.stack([img, img, img], axis=-1)
print(rgb.shape)  # height, width, channels`}
            output={`(8, 8, 3)`}
          >
            <p>
              Real loaders (Pillow, OpenCV, imageio) return arrays like this. Once loaded, all NumPy
              indexing and math skills apply.
            </p>
          </NotebookCell>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Grayscale images ≈ 2-D NumPy arrays; color ≈ 3-D with a channel axis.',
          'Pixel values are just numbers — crop with slices, transform with vectorized math.',
          'Seeing an image as a matrix unlocks filters, masks, and ML image pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
