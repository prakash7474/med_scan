export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;  
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

async function convertWithScale(
    lib: any,
    pdf: any,
    page: any,
    scale: number,
    originalName: string
): Promise<PdfConversionResult> {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve({
                        imageUrl: URL.createObjectURL(blob),
                        file: new File([blob], `${originalName}.png`, { type: "image/png" }),
                    });
                } else {
                    resolve({
                        imageUrl: "",
                        file: null,
                        error: "Failed to create image blob",
                    });
                }
            },
            "image/png",
            1.0
        );
    });
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const originalName = file.name.replace(/\.pdf$/i, "");

        // Try high quality first (scale 4)
        try {
            return await convertWithScale(lib, pdf, page, 4, originalName);
        } catch (highQualityError) {
            console.warn("High quality conversion failed, retrying with lower quality:", highQualityError);
            // Retry with lower quality (scale 2)
            try {
                return await convertWithScale(lib, pdf, page, 2, originalName);
            } catch (lowQualityError) {
                console.error("Low quality conversion also failed:", lowQualityError);
                return {
                    imageUrl: "",
                    file: null,
                    error: "PDF conversion failed due to memory constraints. Please try a smaller PDF file.",
                };
            }
        }
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
