export const readFileAsBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1]; // Quitamos el prefijo
      if (base64) resolve(base64);
      else reject("No se pudo convertir a base64");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
