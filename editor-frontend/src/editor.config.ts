import { reactive } from "vue";

const filePickerCallback = (
  callback: (blobUri: string, options: { title: string }) => void
): void => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.onchange = () => {
    const file = input.files![0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      // @ts-ignore
      const blobCache = tinymce.activeEditor.editorUpload.blobCache;
      const base64 = reader.result
        ? reader.result.toString().split(",")[1]
        : "";
      const blobInfo = blobCache.create(file.name, file, base64);
      blobCache.add(blobInfo);

      callback(blobInfo.blobUri(), { title: file.name });
    };

    reader.readAsDataURL(file);
  };
  input.click();
};

export const tinymceConfig = reactive({
  plugins:
    "link image lists table code fullscreen preview media codesample emoticons wordcount template",
  file_picker_callback: filePickerCallback,
  language: "ru",
  language_url: "/tinyMCE/languages/ru.js",
  toolbar:
    "undo redo | styles | visualblocks | styleselect | bold italic | alignleft  aligncenter alignright alignjustify | numlist bullist outdent indent | link image print preview media | fontfamily fontsize | forecolor backcolor emoticons | codesample | blockquote | wordcount",
  toolbar_mode: "wrap",
  font_size_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
  statusbar: false,
  branding: true,
});
