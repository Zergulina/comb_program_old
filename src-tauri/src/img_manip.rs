pub mod img_manip {
    use base64::{encode_config, STANDARD};
    use serde::Serialize;
    use std::fs::File;
    use std::io::Read;
    use std::path::PathBuf;

    #[derive(Serialize)]
    #[derive(Clone)]
    pub struct ImageData {
        pub encoded: String,
        pub file_format: String,
    }

    pub fn encode_image_to_string(path: &PathBuf) -> Result<ImageData, String> {
        let extension = path
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or_default()
            .to_lowercase();
        let file_format = match extension.as_str() {
            "jpg" | "jpeg" => "jpeg",
            "png" => "png",
            _ => return Err("Неподдерживаемое разрешение файла".to_string()),
        };

        let mut file = File::open(&path).map_err(|e| e.to_string())?;
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

        // return the image data as base64 for the frontend showing
        let base64_string = encode_config(buffer, STANDARD);
        Ok(ImageData {
            encoded: base64_string,
            file_format: file_format.to_string(),
        })
    }

    pub fn get_image_format(file_name: &String) ->  String {
        let splited: Vec<String> = file_name.split('.').map(|item| String::from(item)).collect();
        let format = splited[splited.len()-1].clone();
        format
    }
}
