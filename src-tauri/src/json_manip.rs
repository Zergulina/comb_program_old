pub mod json_manip {
    use tauri::http::header::CONTENT_SECURITY_POLICY;

    use crate::custom_structures::custom_structures::ObjectWithTitleAndPath;
    use crate::file_manip::file_manip::{get_relative_path, get_title_from_path, get_file_data};
    use std::fs;
    use std::io;
    use std::{fs::File, fs::OpenOptions, io::Write};
    use std::collections::HashSet;

    pub fn get_json_data() -> Result<serde_json::Value, io::Error> {
        let file_path = get_relative_path("files.json");
        let json_data_string = fs::read_to_string(file_path)?;
        let json_data: serde_json::Value = serde_json::from_str(&json_data_string)?;
        Ok(json_data)
    }

    pub fn get_titles_from_json(json_data: &serde_json::Value) -> (Vec<String>, Vec<String>) {
        let mut titles: Vec<String> = Vec::new();
        let mut pathes: Vec<String> = Vec::new();

        if let Some(data) = json_data.get("data") {
            if let Some(data_array) = data.as_array() {
                for item in data_array {
                    if let Some(title) = item.get("title") {
                        if let Some(title_string) = title.as_str() {
                            titles.push(title_string.to_string());
                        }
                    }
                    if let Some(path) = item.get("path") {
                        if let Some(path_string) = path.as_str() {
                            pathes.push(path_string.to_string());
                        }
                    }
                }
            }
        }

        (titles, pathes)
    }

    pub fn json_to_vec_data(json_data: &serde_json::Value) -> Vec<ObjectWithTitleAndPath> {
        let vec_data = json_data.get("data").unwrap().as_array().unwrap();
        let vec_objects: Vec<ObjectWithTitleAndPath> = vec_data
            .iter()
            .map(|json_value| {
                let title = json_value
                    .get("title")
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .to_string();
                let path = json_value
                    .get("path")
                    .unwrap()
                    .as_str()
                    .unwrap()
                    .to_string();
                ObjectWithTitleAndPath { title, path }
            })
            .collect();
        vec_objects
    }

    pub fn vec_data_to_json(
        vec_data: &Vec<ObjectWithTitleAndPath>,
    ) -> Result<serde_json::Value, serde_json::Error> {
        let mut map_data = serde_json::Map::new();
        map_data.insert("data".to_string(), serde_json::to_value(vec_data).unwrap());
        serde_json::to_value(map_data)
    }

    pub fn write_new_file_to_json(titles: &Vec<String>, pathes: &Vec<String>, new_title: &String) {
        let json_path = get_relative_path("files.json");
        let mut data_vec = ObjectWithTitleAndPath::vec_from(titles, pathes);
        let new_file_name = format!("{new_title}.cb");
        let new_path = get_relative_path("files")
            .join(new_file_name)
            .to_str()
            .unwrap()
            .to_string();
        let new_data = ObjectWithTitleAndPath::from(new_title, &new_path);
        data_vec.push(new_data);
        let json_data = vec_data_to_json(&data_vec).unwrap();
        let json_string = serde_json::to_string(&json_data).unwrap();
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(json_path)
            .unwrap();
        file.write_all(json_string.as_bytes()).unwrap();
    }

    pub fn get_path_from_title_json(title: &String) -> Result<String, String> {
        let json_data = get_json_data().unwrap();
        let (titles, pathes) = get_titles_from_json(&json_data);
        for i in 0..titles.len() {
            if *title == titles[i] {
                return Ok(pathes[i].to_owned());
            }
        }
        Err(String::from("Указано несуществующее название комбайна!"))
    }
    

    pub fn get_crops_json_from_file(path: &String) -> Result<serde_json::Value, String> {
        let json_data = get_file_data(path)?;
        let crop_json = json_data.get("crops").unwrap().to_owned();
        Ok(crop_json)
    }

    pub fn clean_string_from_quatation_marks(mut string_to_clean: String) -> String {
        let char_vec: Vec<char> = string_to_clean.chars().collect();
        if char_vec[0] == '"' {
            string_to_clean.remove(0);
        }
        if char_vec[char_vec.len() - 1] == '"' {
            string_to_clean.pop();
        }
        string_to_clean
    }

    pub fn get_crop_titles_from_json(json_data: serde_json::Value) -> Result<Vec<String>, String> {
        let crops_vec = match json_data["crops"].as_array() {
            Some(crops_vec) => crops_vec.clone(),
            None => return Err(String::from("Данные повреждены")),
        };

        let mut crops_titles = Vec::<String>::new();

        for crop in crops_vec {
            crops_titles.push(crop["title"].to_string());
        }

        Ok(crops_titles)
    }

    pub fn get_crop_from_json(crops_json: &serde_json::Value, crop_title: &String) -> Result<serde_json::Value, String> {
        let crops_vec = match crops_json.as_array() {
            Some(crops_vec) => crops_vec.clone(),
            None => return Err(String::from("Данные повреждены")),
        };

        for crop in crops_vec {
            if crop["crop"] == *crop_title {
                return Ok(crop["data"].to_owned())
            }
        }

        Err(String::from("Указано несуществующее название культуры!"))
    }

    pub fn add_file_to_json(
        //че?
        path: &String,
        json_data: &serde_json::Value,
    ) -> Result<serde_json::Value, serde_json::Error> {
        let title = get_title_from_path(path);
        let mut vec_objects = json_to_vec_data(json_data);
        vec_objects.push(ObjectWithTitleAndPath {
            title: title,
            path: path.to_string(),
        });
        vec_data_to_json(&vec_objects)
    }

    pub fn add_files_to_json(
        //че?
        vec_pathes: &Vec<String>,
        json_data: &serde_json::Value,
    ) -> Result<serde_json::Value, serde_json::Error> {
        let vec_titles: Vec<String> = vec_pathes
            .iter()
            .map(|path| get_title_from_path(path))
            .collect();
        let mut vec_objects = json_to_vec_data(json_data);
        for item in std::iter::zip(vec_titles, vec_pathes) {
            vec_objects.push(ObjectWithTitleAndPath {
                title: item.0,
                path: item.1.to_string(),
            });
        }
        vec_data_to_json(&vec_objects)
    }
}
