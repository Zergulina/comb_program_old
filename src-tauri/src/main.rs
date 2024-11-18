// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use custom_structures::custom_structures::*;
use file_manip::file_manip::*;
use img_manip::img_manip::encode_image_to_string;
use img_manip::img_manip::ImageData;
use json_manip::json_manip::*;
use rfd::FileDialog;
use serde::Serialize;
use std::{env, fs};
use std::{fs::OpenOptions, io::Write};
use vec_manips::vec_manips::*;
pub mod custom_structures;
pub mod file_manip;
pub mod img_manip;
pub mod json_manip;
pub mod vec_manips;
use std::path::PathBuf;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            init_json_files,
            create_new_comb,
            select_image,
            delete_file_from_json,
            edit_file_from_json,
            get_crop_cards,
            create_new_crop,
            delete_crop,
            edit_crop,
            get_crop_data,
            set_crop_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize, Clone)]
pub struct CardData {
    title: String,
    image: ImageData,
}

#[tauri::command]
fn init_json_files() -> Result<Vec<CardData>, String> {
    let mut json_string = String::from("{\"data\":[]}");
    let file_path = get_relative_path("files.json");
    match get_json_data() {
        Ok(json_data) => {
            let (mut titles, mut pathes) = get_titles_from_json(&json_data);
            let void_titles = get_void_titles(&titles, &pathes);
            (titles, pathes) = remove_void_titles(&void_titles, &titles, &pathes);
            let mut pathes_files = get_pathes("files");
            let mut titles_files = pathes_files
                .iter()
                .map(|path| get_title_from_path(path))
                .collect();
            titles.append(&mut titles_files);
            pathes.append(&mut pathes_files);
            titles = repeats_to_one_in_vec(titles);
            pathes = repeats_to_one_in_vec(pathes);
            let vec_data = ObjectWithTitleAndPath::vec_from(&titles, &pathes);
            let json_data: serde_json::Value = vec_data_to_json(&vec_data).unwrap();
            json_string = serde_json::to_string(&json_data).unwrap();
            let mut file = OpenOptions::new()
                .write(true)
                .truncate(true)
                .open(file_path)
                .unwrap();
            file.write_all(json_string.as_bytes()).unwrap();

            let mut files_data = Vec::<CardData>::new();

            for path in pathes {
                let file_data = get_file_data(&path)?;
                files_data.push(CardData {
                    title: clean_string_from_quatation_marks(file_data["title"].to_string()),
                    image: ImageData {
                        encoded: clean_string_from_quatation_marks(file_data["image"].to_string()),
                        file_format: clean_string_from_quatation_marks(
                            file_data["image_format"].to_string(),
                        ),
                    },
                });
            }

            Ok(files_data)
        }

        Err(_) => {
            let mut file = OpenOptions::new()
                .write(true)
                .create(true)
                .open(file_path)
                .unwrap();
            file.write_all(json_string.as_bytes()).unwrap();
            init_json_files()
        }
    }
}

#[tauri::command]
fn create_new_comb(title: String, img_path: String) -> Result<CardData, String> {
    let json_data = get_json_data().unwrap(); //Нет проверок на ненахождение json
    let (titles, pathes) = get_titles_from_json(&json_data);
    if titles.contains(&title) {
        return Err(String::from("Комбайн с этим именем уже существует"));
    }

    write_new_file_to_json(&titles, &pathes, &title);

    match encode_image_to_string(&PathBuf::from(img_path)) {
        Ok(image_data) => {
            let encoded_string = image_data.encoded;
            let file_format = image_data.file_format;
            let data_string = format!(
                r#"
            {{
                "title": "{title}",
                "crops": [],
                "image": "{encoded_string}",
                "image_format": "{file_format}"
            }}"#
            );
            let file_name = format!("{title}.cb");
            let file_path = get_relative_path("files").join(&file_name);
            let mut file = OpenOptions::new()
                .write(true)
                .create(true)
                .open(file_path)
                .unwrap();
            file.write_all(data_string.as_bytes()).unwrap();
            Ok(CardData {
                title: title,
                image: ImageData {
                    encoded: encoded_string,
                    file_format: file_format,
                },
            })
        }

        Err(error_string) => Err(error_string),
    }
}

#[tauri::command]
fn select_image() -> Result<String, String> {
    let file = FileDialog::new()
        .add_filter("image", &["jpg", "jpeg", "png"])
        .set_directory("/")
        .pick_file();

    match file {
        Some(path) => {
            let extension = path
                .extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or_default()
                .to_lowercase();
            match extension.as_str() {
                "jpg" | "jpeg" => (),
                "png" => (),
                _ => return Err("Неподдерживаемое разрешение файла".to_string()),
            }
            Ok(path.to_string_lossy().to_string())
        }
        None => Err(String::from("Пользователь отменил открытие файла")),
    }
}

#[tauri::command]
fn delete_file_from_json(title_to_delete: String) {
    let json_data: serde_json::Value = get_json_data().unwrap();
    let mut json_data = json_to_vec_data(&json_data);
    for i in 0..json_data.len() {
        if json_data[i].title == title_to_delete.to_owned() {
            fs::remove_file(&json_data[i].path).unwrap();
            json_data.remove(i);
            break;
        }
    }
    let json_data = vec_data_to_json(&json_data).unwrap();
    let json_string = serde_json::to_string(&json_data).unwrap();
    let json_path = get_relative_path("files.json");
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(json_path)
        .unwrap();
    file.write_all(json_string.as_bytes()).unwrap();
}

#[tauri::command]
fn edit_file_from_json(
    title_to_edit: String,
    new_title: String,
    new_img_path: String,
) -> Result<ImageData, String> {
    if new_title.is_empty() {
        return Err(String::from("Название комбайна не может быть пустным"));
    }
    let json_data: serde_json::Value = get_json_data().unwrap();
    let mut json_data_vec = json_to_vec_data(&json_data);
    let mut path = String::new();
    let mut new_path = String::new();
    let mut change_title_flag = false;
    for i in 0..json_data_vec.len() {
        if json_data_vec[i].title == title_to_edit {
            if new_title != title_to_edit {
                let (titles, _) = get_titles_from_json(&json_data);
                if !titles.contains(&new_title) {
                    json_data_vec[i].title = new_title.clone();
                    let json_path = get_relative_path("files.json");
                    let mut splited_vec = split_string(&json_data_vec[i].path, '\\');
                    let last_index = splited_vec.len() - 1;
                    splited_vec[last_index] = format!("{new_title}.cp");
                    path = json_data_vec[i].path.clone();
                    json_data_vec[i].path = splited_vec.join("\\");
                    new_path = json_data_vec[i].path.clone();
                    change_title_flag = true;
                    let mut file = OpenOptions::new()
                        .write(true)
                        .truncate(true)
                        .open(json_path)
                        .unwrap();
                    file.write_all(
                        vec_data_to_json(&json_data_vec)
                            .unwrap()
                            .to_string()
                            .as_bytes(),
                    )
                    .unwrap();
                    break;
                } else {
                    return Err(String::from("Введенное название уже занято!"));
                }
            }
            path = json_data_vec[i].path.clone();
            break;
        }
    }

    let mut data = get_file_data(&path)?;
    fs::remove_file(&path).unwrap();

    if change_title_flag {
        let obj = data.as_object_mut().unwrap();
        obj.insert(String::from("title"), serde_json::json!(&new_title));
        data = serde_json::json!(obj);
        path = new_path;
    }

    if new_img_path != "" {
        let image_data = encode_image_to_string(&PathBuf::from(&new_img_path)).unwrap();
        let obj = data.as_object_mut().unwrap();
        obj.insert(
            String::from("image"),
            serde_json::json!(&image_data.encoded),
        );
        obj.insert(
            String::from("image_format"),
            serde_json::json!(&image_data.file_format),
        );
        data = serde_json::json!(obj);
    }

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .open(&path)
        .unwrap();

    file.write_all(data.to_string().as_bytes()).unwrap();

    Ok(ImageData {
        encoded: clean_string_from_quatation_marks(data["image"].to_string()),
        file_format: clean_string_from_quatation_marks(data["image_format"].to_string()),
    })
}

#[tauri::command]
fn get_crop_cards(comb_title: String) -> Result<Vec<CardData>, String> {
    let path = get_path_from_title_json(&comb_title)?;
    let mut crops_data = Vec::<CardData>::new();
    let mut json_data = get_crops_json_from_file(&path)?;
    let vec_data = match json_data.as_array_mut() {
        Some(crops_vec) => crops_vec,
        None => return Err(String::from("Данные повреждены")),
    };
    if vec_data.len() == 0 {
        //Ошибка не обработана
        return Ok(crops_data);
    }
    for crop_json in vec_data {
        crops_data.push(CardData {
            title: clean_string_from_quatation_marks(crop_json["crop"].to_string()),
            image: ImageData {
                encoded: clean_string_from_quatation_marks(crop_json["image"].to_string()),
                file_format: clean_string_from_quatation_marks(
                    crop_json["image_format"].to_string(),
                ),
            },
        });
    }
    Ok(crops_data)
}

#[tauri::command]
fn create_new_crop(
    comb_title: String,
    crop_title: String,
    img_path: String,
) -> Result<CardData, String> {
    let path = get_path_from_title_json(&comb_title)?;
    let mut crops_json = get_crops_json_from_file(&path)?;
    let crops_vec = match crops_json.as_array_mut() {
        Some(crops_vec) => crops_vec,
        None => return Err(String::from("Данные повреждены")),
    };
    for crop in crops_vec.clone() {
        if crop_title == crop["crop"].to_string() {
            return Err(String::from("Культура с этим именем уже существует"));
        }
    }
    let image_data = encode_image_to_string(&PathBuf::from(img_path))?;
    let encoded_string = image_data.encoded;
    let file_format = image_data.file_format;
    crops_vec.push(serde_json::json!({
        "crop": crop_title,
        "data":{
            "headers": {
                "const": [],
                "editable": []
            },
            "values": []
        },
        "image": encoded_string,
        "image_format": file_format
    }
    ));
    let mut json_data = get_file_data(&path)?;
    json_data["crops"] = serde_json::Value::Array(crops_vec.to_owned());

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .open(&path)
        .unwrap();

    file.write_all(json_data.to_string().as_bytes()).unwrap();

    Ok(CardData {
        title: crop_title,
        image: ImageData {
            encoded: encoded_string,
            file_format: file_format,
        },
    })
}

#[tauri::command]
fn delete_crop(comb_title: String, crop_title_to_delete: String) -> Result<(), String> {
    let path = get_path_from_title_json(&comb_title)?;
    let mut crops_json = get_crops_json_from_file(&path)?;
    let crops_vec = match crops_json.as_array_mut() {
        Some(crops_vec) => crops_vec,
        None => return Err(String::from("Данные повреждены")),
    };

    for i in 0..crops_vec.len() {
        if crop_title_to_delete
            == clean_string_from_quatation_marks(crops_vec[i]["crop"].to_string())
        {
            crops_vec.remove(i);
            break;
        }
    }

    let mut json_data = get_file_data(&path)?;
    json_data["crops"] = serde_json::Value::Array(crops_vec.to_owned());
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .create(true)
        .open(&path)
        .unwrap();

    file.write_all(json_data.to_string().as_bytes()).unwrap();

    Ok(())
}

#[tauri::command]
fn edit_crop(
    comb_title: String,
    crop_title_to_edit: String,
    new_title: String,
    new_img_path: String,
) -> Result<ImageData, String> {
    if new_title == "" {
        return Err(String::from("Название культуры не может быть пустым"));
    }

    let path = get_path_from_title_json(&comb_title)?;
    let mut crops_json = get_crops_json_from_file(&path)?;
    let crops_vec = match crops_json.as_array_mut() {
        Some(crops_vec) => crops_vec,
        None => return Err(String::from("Данные повреждены")),
    };

    let mut index: usize = 0;

    for i in 0..crops_vec.len() {
        if crop_title_to_edit == clean_string_from_quatation_marks(crops_vec[i]["crop"].to_string())
        {
            let crop_titles_vec: Vec<String> = crops_vec
                .clone()
                .iter()
                .map(|crop| clean_string_from_quatation_marks(crop["crop"].to_string()))
                .collect();
            if !crop_titles_vec.contains(&new_title) || new_title == crop_title_to_edit {
                index = i;
                if new_title != crop_title_to_edit {
                    crops_vec[index]["crop"] = serde_json::json!(format!("{new_title}"));
                }
            } else {
                return Err(String::from("Данное название культуры уже занято"));
            }
        }
    }

    if new_img_path != "" {
        let image_data = encode_image_to_string(&PathBuf::from(&new_img_path)).unwrap();
        let encoded_string = image_data.encoded;
        let file_format = image_data.file_format;
        crops_vec[index]["image"] = serde_json::json!(format!("{encoded_string}"));
        crops_vec[index]["image_format"] = serde_json::json!(format!("{file_format}"));
    }

    let mut json_data = get_file_data(&path)?;
    json_data["crops"] = serde_json::Value::Array(crops_vec.to_owned());
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&path)
        .unwrap();

    file.write_all(json_data.to_string().as_bytes()).unwrap();

    Ok(ImageData {
        encoded: clean_string_from_quatation_marks(crops_vec[index]["image"].to_string()),
        file_format: clean_string_from_quatation_marks(crops_vec[index]["file_format"].to_string()),
    })
}

#[tauri::command]
fn get_crop_data(comb_title: String, crop_title: String) -> Result<serde_json::Value, String> {
    let path = get_path_from_title_json(&comb_title)?;
    let crops_json = get_crops_json_from_file(&path)?;
    let crop_data = get_crop_from_json(&crops_json, &crop_title)?;
    Ok(crop_data)
}

#[tauri::command]
fn set_crop_data(
    comb_title: String,
    crop_title: String,
    crop_data: serde_json::Value,
) -> Result<(), String> {
    let path = get_path_from_title_json(&comb_title)?;
    let mut crops_json = get_crops_json_from_file(&path)?;
    let crops_vec = match crops_json.as_array_mut() {
        Some(crops_vec) => crops_vec,
        None => return Err(String::from("Данные повреждены")),
    };

    for i in 0..crops_vec.len() {
        if crop_title == clean_string_from_quatation_marks(crops_vec[i]["crop"].to_string()) {
            crops_vec[i]["data"] = crop_data.to_owned();
            let mut json_data = get_file_data(&path)?;
            json_data["crops"] = serde_json::Value::Array(crops_vec.to_owned());
            let mut file = OpenOptions::new()
                .write(true)
                .create(true)
                .truncate(true)
                .open(&path)
                .unwrap();
            file.write_all(json_data.to_string().as_bytes()).unwrap();
            return Ok(());
        }
    }
    Err(String::from("Указано несуществующее название культуры!"))
}
