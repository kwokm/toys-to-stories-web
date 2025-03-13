'use client';

import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { CameraIcon, SwitchCameraIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ToyData, UserData } from '@/types/types';

interface TakePictureProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  capturedImage: string | null;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TakePicture: React.FC<TakePictureProps> = ({
  userData,
  setUserData,
  capturedImage,
  setCapturedImage,
  isProcessing,
  setIsProcessing,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <h2 className="pb-0 text-3xl font-[700] text-center text-gray-800">
        Let's bring your child's favorite toy to life!
      </h2>
      <p className="pb-4 text-left text-base text-gray-600">
        Snap a photo of your child's favorite toy, and it will become an imaginary friend in a
        personalized story! Along the way, your child will learn four new words in the chosen
        language.
      </p>
      <div className="flex flex-row gap-8 w-full items-center justify-center">
        <UploadButton
          endpoint="imageUploader"
          config={{ cn: twMerge }}
          content={{
            button: ({ ready }) => {
              if (!ready)
                return (
                  <div className="font-medium text-sm flex flex-row gap-2 items-center">
                    <CameraIcon className="w-4 h-4" />
                    Loading...
                  </div>
                );
              return capturedImage ? (
                <div className="font-medium text-sm flex flex-row gap-2 items-center">
                  <SwitchCameraIcon className="w-4 h-4" />
                  Retake Photo
                </div>
              ) : (
                <div className="font-medium text-sm flex flex-row gap-2 items-center">
                  <CameraIcon className="w-4 h-4" />
                  Take a Photo
                </div>
              );
            },
          }}
          className="motion-preset-compress ut-allowed-content:hidden ut-button:ut-readying:bg-gray-600 ut-button:ut-uploading:bg-gray-600 ut-button:bg-black"
          onClientUploadComplete={res => {
            setIsProcessing(true);
            setCapturedImage(
              `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${res[0].key}`
            );
            let newToy: ToyData = {
              key: res[0].key,
              image: res[0].url,
            };
            setUserData(prevUserData => ({
              ...prevUserData,
              toys: [newToy],
            }));
            console.log(res[0].url);

            // Download the image to the server
            fetch('/api/download-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: res[0].url,
                fileName: res[0].name,
              }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Image downloaded to server:', data);
                if (data.success) {
                  const geminiIdentifyData = JSON.parse(data.geminiIdentify);
                  const geminiVocabularyData = JSON.parse(data.geminiVocabulary);
                  newToy = {
                    name: geminiIdentifyData.Name,
                    title: geminiIdentifyData.Item,
                    vocab: geminiVocabularyData.VocabData,
                    key: res[0].key,
                    image: res[0].url,
                  };

                  setUserData(prevUserData => ({
                    ...prevUserData,
                    toys: [newToy],
                  }));

                  console.log("HELLO THE DATA IS ", data);
                  console.log("current userdata is ", userData);

                  // Set processing to false after updating the state
                  setIsProcessing(false);
                }
              })
              .catch(error => {
                console.error('Error downloading image to server:', error);
                setIsProcessing(false);
              });
          }}
          onUploadError={(error: Error) => {
            console.log(error);
            setIsProcessing(false);
          }}
        />
      </div>
      <div className="mt-3 mb-12 mx-auto">
        <Card className="rotate-2 flex w-96 flex-col gap-3 items-center rounded-xs">
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured toy"
              width={300}
              height={300}
              className="rounded-md object-cover h-75 w-75"
            />
          ) : (
            <div className="h-75 w-75 bg-gray-100 rounded-md border border-gray-300"></div>
          )}

          <div className="h-20" />
        </Card>
      </div>
    </div>
  );
};

export default TakePicture;