pub mod vec_manips {
    use std::{collections::HashSet, fmt::format};
    pub fn repeats_to_one_in_vec(vec_pathes: Vec<String>) -> Vec<String> {
        let mut set: HashSet<String> = std::collections::HashSet::new();
        let unique: Vec<String> = vec_pathes
            .into_iter()
            .filter(|element| set.insert(String::from(element)))
            .collect();
        unique
    }

    pub fn remove_void_titles(
        void_titles: &Vec<String>,
        titles: &Vec<String>,
        pathes: &Vec<String>,
    ) -> (Vec<String>, Vec<String>) {
        let mut new_titles = Vec::<String>::new();
        let mut new_pathes = Vec::<String>::new();
        for i in 0..titles.len() {
            if !void_titles.contains(&titles[i]) {
                new_titles.push(titles[i].clone());
                new_pathes.push(pathes[i].clone());
            }
        }
        (new_titles, new_pathes)
    }

    pub fn vec_to_json_string(vec: &Vec<String>) -> String {
        let mut json_string = String::from("{\"data\":[");
        if vec.len() > 0 {
            for i in 0..(vec.len() - 1) {
                let item = &vec[i];
                json_string += &format!("\"{item}\", ");
            }

            let last_string = vec.last().unwrap();
            json_string += &format!("\"{last_string}\"");
        }
        json_string += "]}";
        json_string
    }

    pub fn split_string (data: &String, separator: char) -> Vec<String> {
        let mut v: Vec<String> = Vec::new();
        let mut current_string = String::new();
        
        for c in data.chars() {
            if c == separator {
                v.push(current_string);
                current_string = String::new();
            } else {
                current_string.push(c);
            }
        }
        
        if !current_string.is_empty() {
            v.push(current_string);
        }

        v
    }
}
