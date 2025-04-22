declare module "expo-image-picker" {
  export type MediaTypeOptions = "Images" | "Videos" | "All";
  export type ImagePickerOptions = {
    allowsEditing?: boolean;
    aspect?: [number, number];
    base64?: boolean;
    exif?: boolean;
    mediaTypes?: MediaTypeOptions;
    quality?: number;
  };
  export type ImageInfo = {
    uri: string;
    width: number;
    height: number;
    type: string;
    base64?: string;
    exif?: Record<string, any>;
  };
  export type ImagePickerResult = {
    cancelled: boolean;
    assets?: ImageInfo[];
  };
  export function launchImageLibraryAsync(
    options?: ImagePickerOptions
  ): Promise<ImagePickerResult>;
  export function launchCameraAsync(
    options?: ImagePickerOptions
  ): Promise<ImagePickerResult>;
}
