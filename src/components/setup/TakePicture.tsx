'use client';

import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { CameraIcon, SwitchCameraIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ToyData, UserData, languageCodes } from '@/types/types';

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
      <h2 className="pb-0 text-center text-2xl md:text-3xl font-[700] text-gray-800">
        Let&apos;s bring your child&apos;s favorite toy to life!
      </h2>
      <p className="pb-4 text-center text-base text-gray-600 max-w-[600px]">
        Snap a photo of your child&apos;s favorite toy, and it will become an imaginary friend in a
        personalized story! Along the way, your child will learn four new words in the chosen
        language.
      </p>
      <div className="mx-auto mt-3 mb-12">
        <Card className="flex w-80 sm:w-96 rotate-2 flex-col items-center gap-3 rounded-xs">
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured toy"
              width={300}
              height={300}
              className="h-64 w-64 sm:h-75 sm:w-75 rounded-md object-cover"
            />
          ) : (
            <div className="h-64 w-64 sm:h-75 sm:w-75 rounded-md border border-gray-300 bg-gray-100"></div>
          )}
          
          <div className="h-20 flex">
          <UploadButton
          endpoint="imageUploader"
          config={{ cn: twMerge }}
          content={{
            button: ({ ready }) => {
              if (!ready)
                return (
                  <div className="flex flex-row items-center gap-2 text-sm font-medium">
                    <CameraIcon className="h-4 w-4" />
                    Loading...
                  </div>
                );
              return capturedImage ? (
                <div className="flex flex-row items-center gap-2 text-sm font-medium">
                  <SwitchCameraIcon className="h-4 w-4" />
                  Retake Photo
                </div>
              ) : (
                <div className="flex flex-row items-center gap-2 text-sm font-medium">
                  <CameraIcon className="h-4 w-4" />
                  Take a Photo
                </div>
              );
            },
          }}
          className="my-auto motion-preset-compress ut-button:bg-black ut-allowed-content:hidden ut-button:ut-readying:bg-gray-600 ut-button:ut-uploading:bg-gray-600"
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

            // Download the image to the server
            fetch('/api/process-photo', {
              method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: res[0].url,
                fileName: res[0].name,
                language: languageCodes[userData.language as keyof typeof languageCodes],
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

                  console.log('HELLO THE DATA IS ', data);
                  console.log('current userdata is ', userData);

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
        </Card>
      </div>
    </div>
  );
};

export default TakePicture;
