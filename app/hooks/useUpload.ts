import { useState, useCallback } from 'react';
import { usePuterStore } from '~/lib/puter';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prescriptionKey } from '~/lib/constants';
import { prepareInstructions } from '../../constants';

export const UPLOAD_STEPS = [
    { key: 'upload', label: 'Uploading file', icon: '📤' },
    { key: 'convert', label: 'Converting to image', icon: '🖼️' },
    { key: 'uploadImage', label: 'Uploading image', icon: '☁️' },
    { key: 'prepare', label: 'Preparing data', icon: '📋' },
    { key: 'analyze', label: 'Analyzing prescription', icon: '🔬' },
    { key: 'complete', label: 'Complete', icon: '✅' },
] as const;

export type UploadStepKey = (typeof UPLOAD_STEPS)[number]['key'];

interface UploadState {
    isProcessing: boolean;
    statusText: string;
    file: File | null;
    currentStep: number;
    error: boolean;
}

interface AnalyzeParams {
    patientName: string;
    doctorName: string;
    symptoms: string;
    file: File;
}

export function useUpload() {
    const { fs, ai, kv } = usePuterStore();
    const [state, setState] = useState<UploadState>({
        isProcessing: false,
        statusText: '',
        file: null,
        currentStep: -1,
        error: false,
    });

    const goToStep = useCallback((step: number, text: string) => {
        setState(prev => ({ ...prev, currentStep: step, statusText: text, error: false }));
    }, []);

    const setError = useCallback((text: string) => {
        setState(prev => ({ ...prev, statusText: text, error: true }));
    }, []);

    const setFile = useCallback((file: File | null) => {
        setState(prev => ({ ...prev, file }));
    }, []);

    const setStatusText = useCallback((text: string) => {
        setState(prev => ({ ...prev, statusText: text }));
    }, []);

    const analyze = useCallback(async ({ patientName, doctorName, symptoms, file }: AnalyzeParams) => {
        setState(prev => ({ ...prev, isProcessing: true, currentStep: 0, statusText: UPLOAD_STEPS[0].label, error: false }));

        try {
            // Step 0: Upload the original file
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) {
                setError('Failed to upload file');
                return null;
            }

            // Step 1: Convert PDF to image
            goToStep(1, UPLOAD_STEPS[1].label);
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) {
                setError('Failed to convert PDF to image');
                return null;
            }

            // Step 2: Upload the image
            goToStep(2, UPLOAD_STEPS[2].label);
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) {
                setError('Failed to upload image');
                return null;
            }

            // Step 3: Prepare data
            goToStep(3, UPLOAD_STEPS[3].label);
            const uuid = generateUUID();
            const data = {
                id: uuid,
                prescriptionPath: uploadedFile.path,
                imagePath: uploadedImage.path,
                patientName,
                doctorName,
                symptoms,
                feedback: '',
            };
            await kv.set(prescriptionKey(uuid), JSON.stringify(data));

            // Step 4: Analyze with AI
            goToStep(4, UPLOAD_STEPS[4].label);
            const feedback = await ai.feedback(
                uploadedImage.path,
                prepareInstructions({ patientName, doctorName, symptoms })
            );

            if (!feedback) {
                setError('Failed to analyze prescription');
                return null;
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            // Parse feedback JSON
            let jsonText = feedbackText;
            if (feedbackText.includes('```json')) {
                const jsonMatch = feedbackText.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    jsonText = jsonMatch[1];
                }
            }

            data.feedback = JSON.parse(jsonText);
            await kv.set(prescriptionKey(uuid), JSON.stringify(data));

            // Step 5: Complete
            goToStep(5, UPLOAD_STEPS[5].label);
            return uuid;

        } catch (error) {
            console.error('Upload analysis failed:', error);
            setError('Failed to process prescription');
            return null;
        } finally {
            setState(prev => ({ ...prev, isProcessing: false }));
        }
    }, [fs, ai, kv, goToStep, setError]);

    return {
        ...state,
        setFile,
        analyze,
    };
}
