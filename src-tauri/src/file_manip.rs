pub mod file_manip {
    use std::env;
    use std::fs;
    use std::io;
    use std::path::PathBuf;
    use std::str::FromStr;

    // use crate::get_titles_from_json;

    pub fn get_void_titles(titles: &Vec<String>, pathes: &Vec<String>) -> Vec<String> {
        let mut void_titles = Vec::<String>::new();
        for item in std::iter::zip(titles, pathes) {
            if !fs::metadata(item.1).is_ok() {
                void_titles.push(item.0.clone());
            };
        }
        void_titles
    }

    pub fn get_title_from_path(path: &String) -> String {
        let path_splited: Vec<&str> = path.split('\\').collect();
        let path_splited: Vec<String> = path_splited
            .iter()
            .map(|&item| String::from(item))
            .collect();
        let title = path_splited.last().unwrap();
        let title: Vec<&str> = title.split('.').collect();
        let title = String::from(title[0]);
        title
    }

    pub fn get_pathes(dir: &str) -> Vec<String> {
        let dir_path = get_relative_path(dir);
        let mut vec_pathes = Vec::<String>::new();
        if check_directory_exists(&dir_path) {
            let dir_path_str = dir_path.clone().into_os_string();
            let dir_path_str = dir_path_str.into_string().unwrap();
            for entry in fs::read_dir(dir_path).unwrap() {
                let entry = entry.unwrap();
                let file_name = entry
                    .path()
                    .file_name()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string();
                if file_name.split('.').last().unwrap() == "cb" {
                    vec_pathes.push(format!("{dir_path_str}\\{file_name}"));
                }
            }
        } else {
            fs::create_dir(dir_path).unwrap();
        }

        vec_pathes
    }

    pub fn remove_void_files(
        void_titles: &Vec<String>,
        dir: &str,
        file_type: &str,
    ) -> Result<(), io::Error> {
        for file_title in void_titles {
            fs::remove_file(format!("{dir}/{file_title}.{file_type}"))?;
        }
        Ok(())
    }

    pub fn select_file(filters: Option<(&[&str], &str)>) -> Result<PathBuf, io::Error> {
        let dir_path = match tinyfiledialogs::open_file_dialog("Select a file", "", filters) {
            Some(path) => PathBuf::from(path),
            None => {
                return Err(io::Error::new(
                    io::ErrorKind::Other,
                    "File selection cancelled",
                ))
            }
        };

        if dir_path.is_file() {
            Ok(dir_path)
        } else {
            Err(io::Error::new(
                io::ErrorKind::Other,
                "Selected path is not a file",
            ))
        }
    }

    pub fn check_directory_exists(path: &PathBuf) -> bool {
        if let Ok(metadata) = fs::metadata(path) {
            return metadata.is_dir();
        }
        false
    }

    pub fn get_file_data(path: &str) -> Result<serde_json::Value, String> {
        let data_string = fs::read_to_string(path).unwrap();
        let data = serde_json::Value::from_str(&data_string);
        match data {
            Ok(data) => Ok(data),
            Err(_) => Err(String::from("Данные повреждены"))
        }
    }

    pub fn get_relative_path(dir: &str) -> PathBuf {
        let current_exe_path = env::current_exe().expect("Failed to get current executable path");
        let exe_dir = current_exe_path
            .parent()
            .expect("Failed to get parent directory of executable");
        let dir_path = exe_dir.join(dir);
        dir_path
    }

    pub fn remove_files_from_dir(dir: &str) {
        let dir_path = get_relative_path(dir);
        for entry in fs::read_dir(dir_path).unwrap() {
            let entry = entry.unwrap();
            fs::remove_file(entry.path()).unwrap();
        }
    }

    fn get_all_comb_data(pathes_vec: &Vec<String>) -> Vec<String> {
        let mut comb_data_vec = Vec::<String>::new();

        for path in pathes_vec {
            comb_data_vec.push(fs::read_to_string(path).unwrap());
        }

        comb_data_vec
    }
}
